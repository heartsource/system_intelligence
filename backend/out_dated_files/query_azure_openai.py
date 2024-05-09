# Set your Azure Cognitive Services endpoint and API key
AZURE_OPENAI_ENDPOINT = "https://productsupportopenai.openai.azure.com/"
AZURE_OPENAI_API_KEY = "024aef7c53dc454e8061bafe3c23f171"

import os
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-02-01",
    azure_endpoint=AZURE_OPENAI_ENDPOINT
)
# This will correspond to the custom name you chose for your deployment when you deployed a model. Use a gpt-35-turbo-instruct deployment.
deployment_name = 'system-intelligence-gpt-35-turbo-instruct'

# Send a completion call to generate an answer
print('Sending a test completion job')
prompt = 'What kind of rats are used for research??'

# Define your template with context and prompt
template_with_context_and_prompt = """
You are Heartie, start with a salutation and and Intro on what you are capable of doing with
Context:
John is a scientist working at a research institute. He is conducting experiments to study the behavior of rats.

Prompt:
Write a conclusion for John's experiment.  {prompt}
"""
response = client.completions.create(model=deployment_name, prompt=template_with_context_and_prompt, max_tokens=200)
print(response.choices[0].text)
