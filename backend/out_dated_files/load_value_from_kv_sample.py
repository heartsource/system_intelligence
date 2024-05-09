import sys
sys.path.append("../app")

from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault

config = get_configs()

openai_api_key = get_value_from_key_vault(config.get("AZURE_OPENAI_API_KEY"))

print(f"OpenAI API key: {openai_api_key}")