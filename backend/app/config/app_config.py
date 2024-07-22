import os;
from dotenv import load_dotenv

load_dotenv()

class AppConfig:
    def __init__(self):
        self.debug = os.getenv('DEBUG')
        self.azure_client_id = os.getenv('AZURE_CLIENT_ID', "7f35cd86-e3e8-4d70-833a-8961f6dc9d82")
        self.azure_tenant_id = os.getenv('AZURE_TENANT_ID', "0d8d044e-89bf-4722-9556-04163b0c4348")
        self.azure_client_secret_value = os.getenv('AZURE_CLIENT_SECRET_VALUE', "8GD8Q~5HXHTY-wj6MBD7w0OgBGjNcvrVTwDMUaIW")
        self.azure_vault_url = os.getenv('AZURE_VAULT_URL', "https://productsupport-kv.vault.azure.net/")
        self.open_ai_api_key = os.getenv('OPEN_AI_API_KEY', "product-support-ai-openai-api-key1")
        self.azure_openai_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT', 'https://productsupportopenai.openai.azure.com/')
        self.azure_openai_api_key = os.getenv('AZURE_OPENAI_API_KEY', 'system-intelligence-ai-openai-api-key')
        self.azure_openai_api_version = os.getenv('AZURE_OPENAI_API_VERSION', '2024-02-01')
        self.azure_deployment_name = os.getenv('AZURE_DEPLOYMENT_NAME', 'system-intelligence-gpt-35-turbo-instruct')
        self.openai_max_tokens = int(os.getenv('OPENAI_MAX_TOKENS', 250))
        self.openai_temperature = float(os.getenv('OPENAI_TEMPERATURE', 0.5))
        
        self.llama_max_tokens = int(os.getenv('LLAMA_MAX_TOKENS', 128))
        self.llama_temperature = float(os.getenv('LLAMA_TEMPERATURE', 0.58))
        self.llama_top_p = float(os.getenv('LLAMA_TOP_P', 0.1))
        self.llama_best_of = int(os.getenv('LLAMA_BEST_OF', 1))
        self.llama_presence_penality = int(os.getenv('LLAMA_PRESENCE_PENALITY', 0))
        self.llama_endpoint = os.getenv('LLAMA_ENDPOINT', 'https://Meta-Llama-3-70B-Instruct-ztbdq-serverless.eastus2.inference.ai.azure.com/v1/chat/completions')
        self.llama_api_key = os.getenv('LLAMA_API_KEY')

        # self.llama_model_local_path = os.getenv('LLAMA_MODEL_LOCAL_PATH', "../model/llama-2-7b-chat.Q5_0.gguf")
        # self.llama_model_path = os.getenv('LLAMA_MODEL_PATH', "/model/llama-2-7b-chat.Q5_0.gguf")
        
        # self.template_ai = os.getenv('TEMPLATE_AI', "You are a support agent designed to answer customer queries using only the provided context. Keep your responses short and precise with completed sentences limited to 500 words.\n\nInteraction Guidelines:\n\nStarting the Interaction:\n- If the customer greets with 'Hi' or 'Hello' begin by introducing yourself. Example: Hello I'm your support agent. How can I assist you today based on the provided context?\n- For all other greetings or queries proceed directly to answering based on the provided context.\n\nAnswering Questions:\n- If you have complete information provide a precise answer. Example: Yes we offer free shipping on all orders over $50.\n- If you have partial information provide a brief answer with a disclaimer. Example: I believe our return policy allows returns within 30 days but please check the details on our website to be sure.\n- If there is no information politely state that. Example: I do not have enough information to answer your question. I will follow up on this and get back to you in a few days with the required information.\n\nEnding the Interaction:\n- Conclude by thanking the customer and reiterating your role. Example: Thank you for your question! If you need further assistance feel free to ask.\n\nTone and Language:\n- Maintain a professional and business-focused tone throughout the conversation.\n- Use clear and concise language to uphold professionalism.\n\nObjective:\n- Focus on providing accurate and concise information ensuring the customer feels informed and valued. Context: {}. Prompt: {}.")
        # self.template_ai_dyn_prompt = os.getenv('TEMPLATE_AI_DYN_PROMPT', '{}. Context: {}. Prompt: {}.')

appConfig = AppConfig()