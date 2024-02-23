from fastapi import FastAPI
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault

config = get_configs()

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello1 World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello1 {name}"}


@app.post("/talk_to_openai_heartie/")
async def talk_to_openai_heartie(prompt: str):
#def talk_to_openai_heartie(prompt: str):
    from openai import OpenAI

    api_key = get_value_from_key_vault(config.get("OPEN_AI_API_KEY"))

    client = OpenAI(
        api_key=api_key
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


@app.post("/talk_to_embedded_llama_heartie/")
async def talk_to_embedded_llama_heartie(prompt: str, model_path=config.get("LLAMA_MODEL_PATH")):
#def talk_to_embedded_llama_heartie(prompt, model_path=config.get("LLAMA_MODEL_PATH")):

    from llama_cpp import Llama
    llm = Llama (model_path=model_path)
    model_response = llm(prompt,)
    print(model_response)
    return_value = model_response.get("choices")[0].get("text")
    return return_value
