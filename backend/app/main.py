import asyncio
import os

from fastapi import FastAPI
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault
from chromadb.utils import embedding_functions
import uuid

config = get_configs()

tags_metadata = [
    {
        "name": "load_to_chromadb",
        "description": "This endpoint is to load files to chroma to define context for the end user search.  This"
                       "Version can load Docx, Doc, txt, PDF or wiki.  "
                       "if Docx, Doc, txt, PDF please provide the type and the file name with path"
                       "if wiki context parameter is used to find the wiki to load. ",
        "externalDocs": {
            "description": "Some extrenal tags",
            "url": "https://change.com/",
        },
    },
    {
            "name": "talk_to_heartie",
        "description": "Using Retreival Augmented Generation.  This uses the chromadb used to do a semantic search "
                       "to contextualize the customer query before hitting the openai for results.  This endpoint uses"
                       "RAG (Retreival Augmented Generation) to make the results relevant to the context.",
        "externalDocs": {
                "description": "Some extrenal tags",
                "url": "https://change.com/",
        },
    },
]
app = FastAPI(openapi_tags=tags_metadata)

@app.get("/")
async def root():
    return {"message": "Hello1 World"}


@app.post("/talk_to_heartie/", tags=["talk_to_heartie"])
async def talk_to_heartie(question: str):
    #Context creation
    from chromadb_reader_writer import chromadb_reader
    print('Heartie is in Action:  Started ... ')
    context = chromadb_reader(question)

    # Set your Azure Cognitive Services endpoint and API key
    azure_openai_endpoint = config.get("AZURE_OPENAI_ENDPOINT")
    azure_deployment_name = config.get("AZURE_DEPLOYMENT_NAME")
    from key_vault_secret_loader import get_value_from_key_vault
    azure_openai_api_key = get_value_from_key_vault(config.get("AZURE_OPENAI_API_KEY"))

    from openai import AzureOpenAI
    client = AzureOpenAI(
        api_key=azure_openai_api_key,
        api_version="2024-02-01",
        azure_endpoint=azure_openai_endpoint
    )
    # This will correspond to the custom name you chose for your deployment when you deployed a model.
    # Use a gpt-35-turbo-instruct deployment.
    deployment_name = 'system-intelligence-gpt-35-turbo-instruct'

    # Define your template with context and prompt
    template = config.get("TEMPLATE_AI")
    template_with_context_and_question = template.format(context, question)
    print(f"Template with substitutions :{template_with_context_and_question}")

    response = client.completions.create(model=azure_deployment_name, prompt=template_with_context_and_question, max_tokens=200)
    return_value = response.choices[0].text
    print('Heartie is in Action:  Ended')
    return return_value

@app.post("/load_to_chromadb/", tags=["load_to_chromadb"])
async def load_to_chromadb(file_content):
    return_value = True
    from chromadb_reader_writer import chromadb_writer
    chromadb_writer(file_content)
    return return_value

#return_value = asyncio.run(load_file_to_chromadb("pdf", context="Nissan Leaf", file_path="../knowledge/2020-nissan-leaf-owner-manual.pdf"))
#return_value = asyncio.run(load_file_to_chromadb("wiki", context="Nissan Leaf", file_path="../knowledge/Derby_15_Jun_2023.pdf"))
#return_value = asyncio.run(load_file_to_chromadb("txt", context="Nissan Leaf", file_path="../knowledge/nissan_history.txt"))
#return_value = asyncio.run(load_file_to_chromadb("doc", context="Nissan Leaf", file_path="../knowledge/2023_leaf_warranty.docx"))
#return_value = asyncio.run(load_to_chromadb("This is a file content loaded from external sources"))
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



