import os;
from dotenv import load_dotenv

load_dotenv()

class AppConfig:
    def __init__(self):
        self.debug = os.getenv('DEBUG')
        self.azure_client_id = os.getenv('AZURE_CLIENT_ID')
        self.azure_tenant_id = os.getenv('AZURE_TENANT_ID')
        self.azure_client_secret_value = os.getenv('AZURE_CLIENT_SECRET_VALUE')
        self.azure_vault_url = os.getenv('AZURE_VAULT_URL')
        self.open_ai_api_key = os.getenv('OPEN_AI_API_KEY')
        self.azure_openai_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT')
        self.azure_openai_api_key = os.getenv('AZURE_OPENAI_API_KEY')
        self.azure_openai_api_version = os.getenv('AZURE_OPENAI_API_VERSION')
        self.azure_deployment_name = os.getenv('AZURE_DEPLOYMENT_NAME')
        self.openai_max_tokens = int(os.getenv('OPENAI_MAX_TOKENS'))
        self.openai_temperature = float(os.getenv('OPENAI_TEMPERATURE'))
        
        self.llama_max_tokens = int(os.getenv('LLAMA_MAX_TOKENS'))
        self.llama_temperature = float(os.getenv('LLAMA_TEMPERATURE'))
        self.llama_top_p = float(os.getenv('LLAMA_TOP_P'))
        self.llama_best_of = int(os.getenv('LLAMA_BEST_OF'))
        self.llama_presence_penality = int(os.getenv('LLAMA_PRESENCE_PENALITY'))
        self.llama_endpoint = os.getenv('LLAMA_ENDPOINT')
        self.llama_api_key = os.getenv('LLAMA_API_KEY')

        # self.llama_model_local_path = os.getenv('LLAMA_MODEL_LOCAL_PATH')
        # self.llama_model_path = os.getenv('LLAMA_MODEL_PATH')
        
        # self.template_ai = os.getenv('TEMPLATE_AI')
        # self.template_ai_dyn_prompt = os.getenv('TEMPLATE_AI_DYN_PROMPT')

appConfig = AppConfig()