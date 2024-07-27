from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
from config.app_config import appConfig

client_id = appConfig.azure_client_id
client_secret = appConfig.azure_client_secret_value
tenant_id = appConfig.azure_tenant_id
vault_url = appConfig.azure_vault_url


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


#print(get_value_from_key_vault(appConfig.get("OPEN_AI_API_KEY")))