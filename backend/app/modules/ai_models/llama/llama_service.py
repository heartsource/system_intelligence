import urllib.request
import json
import os
import ssl
import re
from config.app_config import appConfig

class LlamaService:
    def allowSelfSignedHttps(allowed):
        # bypass the server certificate verification on client side
        if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
            ssl._create_default_https_context = ssl._create_unverified_context

    allowSelfSignedHttps(True) # this line is needed if you use self-signed certificate in your scoring service.


    async def LlamaChatCompletions(self, prompt = None):
        # Request data goes here
        # The example below assumes JSON formatting which may be updated
        # depending on the format your endpoint expects.
        # More information can be found here:
        # https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script

        messages = [{"role": "user", "content": prompt}]
        data =  {
        "messages": messages,
        "max_tokens": appConfig.llama_max_tokens,
        "temperature": appConfig.llama_temperature,
        "top_p": appConfig.llama_top_p,
        "best_of": appConfig.llama_best_of,
        "presence_penalty": appConfig.llama_presence_penality,
        "use_beam_search": "false",
        "ignore_eos": "false",
        "skip_special_tokens": "false",
        "logprobs": "false"
        }

        body = str.encode(json.dumps(data))

        # Replace this with the primary/secondary key, AMLToken, or Microsoft Entra ID token for the endpoint
        api_key = appConfig.llama_api_key
        if not api_key:
            raise Exception("A key should be provided to invoke the endpoint")


        headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

        req = urllib.request.Request(appConfig.llama_endpoint, body, headers)

        try:
            response = urllib.request.urlopen(req)
            result = json.loads(response.read().decode('utf-8'))
            # Clean the response to remove newline characters and return the message content
            return re.sub(r'\n+', ' ', result['choices'][0]['message']['content']).strip()
        except urllib.error.HTTPError as error:
            print("The request failed with status code: " + str(error.code))

            # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
            print(error.info())
            print(error.read().decode("utf8", 'ignore'))
            raise Exception(error.info())
