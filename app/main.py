from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello1 World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello1 {name}"}


@app.post("/talk_to_heartie/")
async def talk_to_heartie(prompt: str):
    from openai import OpenAI

    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY").  Todo: This is to be externalized
        api_key="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",
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

