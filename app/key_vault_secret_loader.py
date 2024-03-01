from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from config_Loader import get_configs

config = get_configs()

client_id = config.get("AZURE_CLIENT_ID")
client_secret = config.get("AZURE_CLIENT_SECRET_VALUE")
tenant_id = config.get("AZURE_TENANT_ID")
vault_url = config.get("AZURE_VAULT_URL")


def get_value_from_key_vault(keyvault_secret_key):
    client_credential = ClientSecretCredential(
        client_id=client_id,
        client_secret=client_secret,
        tenant_id=tenant_id
    )
    secret_client = SecretClient(
        vault_url=vault_url,
        credential=client_credential
    )
    keyvault_secret_value = secret_client.get_secret(keyvault_secret_key).value
    #print(f"The secret key {keyvault_secret_key} has the value {keyvault_secret_value}")
    return keyvault_secret_value


#print(get_value_from_key_vault(config.get("OPEN_AI_API_KEY")))