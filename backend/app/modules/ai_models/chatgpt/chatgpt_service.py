import re
from openai import AzureOpenAI
from key_vault_secret_loader import get_value_from_key_vault
from config_Loader import get_configs
from config.app_config import appConfig

class ChatGPTService:
    async def chatGPTChatCompletions(self, prompt = None):
        try:
            azure_openai_api_key = get_value_from_key_vault(appConfig.azure_openai_api_key)
            # Set your Azure Cognitive Services endpoint and API key
            client = AzureOpenAI(
                api_key=azure_openai_api_key,
                api_version= appConfig.azure_openai_api_version,
                azure_endpoint=appConfig.azure_openai_endpoint
            )

            # This will correspond to the custom name you chose for your deployment when you deployed a model.
            # Use a gpt-35-turbo-instruct deployment model.
            response = client.completions.create(
                model=appConfig.azure_deployment_name, 
                prompt=prompt, 
                max_tokens=appConfig.openai_max_tokens,
                temperature=appConfig.openai_temperature
            )
            # Clean the response to remove newline characters
            return re.sub(r'\n+', ' ', response.choices[0].text).strip()
        except Exception as e:
            raise Exception(e)