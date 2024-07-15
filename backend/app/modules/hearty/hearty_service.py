from datetime import datetime
from utils.enums.shared_enum import Model
from modules.agents.agents_service import AgentService
from modules.logs.logs_service import LogService
from config_Loader import get_configs
from uuid import uuid4
import re
from bson import ObjectId
from fastapi import HTTPException
import utils.constants.error_constants as ERROR_CONSTANTS
from chromadb_reader_writer import chromadb_reader
from openai import AzureOpenAI
from key_vault_secret_loader import get_value_from_key_vault

config = get_configs()
agent_service = AgentService()
logs_service = LogService()
async def talkToHeartie(question = None, prompt= None, model = None, flow= None, payload= None):
    try:
        #If payload is available use it
        if payload is not None:
            question = payload.question
            prompt = payload.prompt
            model = payload.model
            flow = payload.flow

        
        agent_data = await agent_service.fetchAgentDetails(payload.agent_id)
        if agent_data is None or agent_data['model'] != payload.model or agent_data['flow'] != payload.flow:
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_MISMATCH_ERROR)
        
        print('Heartie is in Action:  Started ... ')

        agentlog = {
            "agent_id": ObjectId(payload.agent_id),
            "interaction_id": str(uuid4()),
            "interaction_date": datetime.now()
        }

        chromaTimeStart = datetime.now()
        context = chromadb_reader(question) #Context creation
        chromaTime = datetime.now() - chromaTimeStart
        print("chromadb reader ended")
        print(chromaTime.total_seconds())
        
        # Set your Azure Cognitive Services endpoint and API key
        azure_openai_endpoint = config.get("AZURE_OPENAI_ENDPOINT")
        # This will correspond to the custom name you chose for your deployment when you deployed a model.
        # Use a gpt-35-turbo-instruct deployment.
        azure_deployment_name = config.get("AZURE_DEPLOYMENT_NAME")

        azure_openai_api_key = get_value_from_key_vault(config.get("AZURE_OPENAI_API_KEY"))

        client = AzureOpenAI(
            api_key=azure_openai_api_key,
            api_version="2024-02-01",
            azure_endpoint=azure_openai_endpoint
        )

        # Define your template with context and prompt
        template = config.get("TEMPLATE_AI")
        template_with_context_and_question = template.format(context, question)
        if prompt is not None:
            template = config.get("TEMPLATE_AI_DYN_PROMPT")
            template_with_context_and_question = template.format(prompt, context, question)
        #print(f"Template with substitutions :{template_with_context_and_question}")
        openAPITimeStart = datetime.now()
        response = client.completions.create(model=azure_deployment_name, prompt=template_with_context_and_question, max_tokens=250)
        # Clean the response to remove newline characters
        openAPITime = datetime.now() - openAPITimeStart
        print(f"Template time: {openAPITime.total_seconds()}")
        return_value = re.sub(r'\n+', ' ', response.choices[0].text).strip()
        print('Heartie is in Action:  Ended')
        agentlog['duration'] = datetime.now() - agentlog['interaction_date']
        agentlog['question'] = question
        agentlog['answer'] = return_value
        agentlog['model'] = model
        agentlog['flow'] = flow
        await logs_service.createAgentLogs(agentlog)
        return return_value
    except Exception as e:
        raise Exception(e)


query1="Tell me about the warranty period of Leaf?"
query2="what is special about e-pedal?"
query3="Tell me about the warranty of toyota avansis?"
query4="Tell me about leaf?"
query5="What is intelligent pro?"
query6="when would you suspect a seat belt malfunctioning?"
query7="when would a seat belt warning glow?  when would you deem it malfunctioning?"
query8="do you know anything about pedestrian detection?"
#return_value = asyncio.run(talk_to_heartie(query8))
#print(f"""The return value is \n \n {return_value}""")