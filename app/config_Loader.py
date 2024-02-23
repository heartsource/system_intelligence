import json


def get_configs():
    with open('../config/config.json') as secrets_file:
        secrets = json.load(secrets_file)
    return secrets


#print(get_configs())