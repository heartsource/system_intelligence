from datetime import datetime, timezone
from modules.knowledge_upload.knowledge_upload_service import KnowledgeUploadService
from modules.enrichment.enrichment_service import EnrichmentRequestService
from modules.ai_models.chatgpt.chatgpt_service import ChatGPTService
from modules.ai_models.llama.llama_service import LlamaService
from utils.enums.shared_enum import Model
from modules.agents.agents_service import AgentService
from modules.logs.logs_service import LogService
from uuid import uuid4
from bson import ObjectId
from fastapi import HTTPException
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS
from modules.shared.chromadb_reader_writer import chromadb_reader
from modules.shared.key_vault_secret_loader import get_value_from_key_vault

agent_service = AgentService()
logs_service = LogService()
chatgpt_service = ChatGPTService()
llama_service = LlamaService()
knowledge_upload_service = KnowledgeUploadService()
enrichment_service = EnrichmentRequestService()

async def talkToHeartie(question = None, prompt= None, model = None, flow= None, payload= None):
    try:
        print('Heartie is in Action:  Started ... ')
        #If payload is available use it
        if payload is not None:
            question = payload.question
            prompt = payload.prompt
            model = payload.model
            flow = payload.flow

        agentlog = {
            "agent_id": ObjectId(payload.agent_id),
            "interaction_id": str(uuid4()),
            "interaction_date": datetime.now(timezone.utc)
        }
        agent_data = await agent_service.fetchAgentDetails(payload.agent_id)
        if agent_data is None or agent_data['model'] != payload.model or agent_data['flow'] != payload.flow:
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.AGENT_MISMATCH_ERROR)
        
        context = chromadb_reader(question) #Context creation
        # Define your template with context and prompt

        template_with_context_and_question = ""
        template = ''
        if prompt is not None:
            template = prompt
            # template_with_context_and_question = template.format(prompt, context, question)
            template_with_context_and_question = f"{prompt} Context: {context}. Prompt: {question}"
        else:
            agent_config = await knowledge_upload_service.getAiPrompts()
            template = agent_config['template']
            template_with_context_and_question = f"{agent_config['template']} Context: {context}. Prompt: {question}"

        if model == Model.ChatGPT4:
            ai_model_response = await chatgpt_service.chatGPTChatCompletions(template_with_context_and_question)
        elif model == Model.Llama3:
            ai_model_response = await llama_service.LlamaChatCompletions(template_with_context_and_question)
        elif model == Model.Mistral:
            raise HTTPException(status_code=400, detail=APP_CONSTANTS.MODEL_INPROGRESS)
        else:
            raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INVALID_MODEL_ERROR)

        not_found = "I do not have enough information to answer your question"
        if not_found in ai_model_response:
            await enrichment_service.createEnrichmentRequest({"query": question, "agent_id": payload.agent_id})

        print('Heartie is in Action:  Ended')
        
        agentlog['duration'] = datetime.now(timezone.utc) - agentlog['interaction_date']
        agentlog['question'] = question
        agentlog['template'] = template
        agentlog['answer'] = ai_model_response
        agentlog['model'] = model
        agentlog['flow'] = flow
        await logs_service.createAgentLogs(agentlog)
        return ai_model_response
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