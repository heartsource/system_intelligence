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

print(f"Prompt for the model is :: {prompt}")
print("-------------------------------------------OPENAI--------------------------------------------------------------")
print(f"The response from openai is :: {response_from_openai}")
print(f"Time taken for openai is : {openai_time}")
print("-------------------------------------------Llama-Huggingface --------------------------------------------------")
print(f"The response from embedded model is :: {response_from_embedded_model}")
print(f"Time taken for embedded model is : {embedded_model_time}")
print("---------------------------------------------------------------------------------------------------------------")
