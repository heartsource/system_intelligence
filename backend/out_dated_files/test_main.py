import asyncio
import time
from config_Loader import get_configs
config = get_configs()

from main import talk_to_openai_heartie, talk_to_embedded_llama_heartie

prompt = "what are LLMs and how is it used in NLP??"
from datetime import datetime
openai_start_time = datetime.now()
response_from_openai = asyncio.run(talk_to_openai_heartie(prompt))
openai_time = datetime.now() - openai_start_time
embedded_model_start_time = datetime.now()
response_from_embedded_model = asyncio.run(talk_to_embedded_llama_heartie(prompt, model_path=config.get("LLAMA_MODEL_LOCAL_PATH")))
embedded_model_time = datetime.now()-embedded_model_start_time

rag_wiki_model_start_time = datetime.now()
wiki_prompt = "Tell me about the first generation of Nissan Leaf?"
wiki_return_value = asyncio.run(talk_to_embedded_rag_langchain_openai_wiki_heartie(wiki_prompt))
rag_wiki_model_time = datetime.now() - rag_wiki_model_start_time

rag_pdf_model_start_time = datetime.now()
pdf_prompt = "Can you explain regenerative break system?"
pdf_return_value = asyncio.run(talk_to_embedded_rag_langchain_openai_pdf_heartie(pdf_prompt, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_LOCAL_PATH")))
rag_pdf_model_time = datetime.now() - rag_pdf_model_start_time

print(f"Return value from OpenAI with PDF: {pdf_return_value}")
#asyncio.run(talk_to_embedded_rag_langchain_openai_pdf_heartie(prompt, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_LOCAL_PATH")))

print("-------------------------------------------OPENAI--------------------------------------------------------------")
print(f"Prompt for the model is :: {prompt}")
print(f"The response from openai is :: {response_from_openai}")
print(f"Time taken for openai is : {openai_time}")
print("-------------------------------------------Llama-Huggingface --------------------------------------------------")
print(f"Prompt for the model is :: {prompt}")
print(f"The response from embedded model is :: {response_from_embedded_model}")
print(f"Time taken for embedded model is : {embedded_model_time}")
print("-------------------------------------------RAG Open AI Wiki ---------------------------------------------------")
print(f"Prompt for the wiki model is :: {wiki_prompt}")
print(f"Return value from OpenAI with Wiki: {wiki_return_value}")
print(f"Time taken for RAG based Wikk model is : {rag_wiki_model_time}")
print("-------------------------------------------RAG Open AI PDF ----------------------------------------------------")
print(f"Prompt for the wiki model is :: {pdf_prompt}")
print(f"Return value from OpenAI with Wiki: {pdf_return_value}")
print(f"Time taken for RAG based Wikk model is : {rag_pdf_model_time}")
print("---------------------------------------------------------------------------------------------------------------")
