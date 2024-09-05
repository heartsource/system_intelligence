import os
import utils.constants.error_constants as ERROR_CONSTANTS
import chromadb
from dotenv import load_dotenv
from fastapi import HTTPException
from chromadb.utils import embedding_functions

load_dotenv()

class ChromaDbConfig:
    def __init__(self) -> None:
        try:
            self.chromaDb_host = os.getenv('CHROMA_HOST')
            self.chromaDb_port = int(os.getenv('CHROMA_PORT'))
            self.chromaDb_path = os.getenv('CHROMA_DB_PATH')
            self.chromaDb_name = os.getenv('CHROMA_DB_NAME')
            self.chromaDb_collection_name = os.getenv('CHROMA_DB_COLLECTION_NAME')
            self.chromaDb_reader_embed_model = os.getenv('CHROMA_DB_READER_EMBED_MODEL') # This is better trained
            self.chromaDb_writer_embed_model = os.getenv('CHROMA_DB_WRITER_EMBED_MODEL') # This is better trained
        except Exception as e:
            print(f"Error initializing ChromaDB config: {e}")
            raise HTTPException(status_code=500, detail=ERROR_CONSTANTS.CHORMADB_CONN_ERROR)

    def get_client(self):
        try:
            #client = chromadb.PersistentClient(path=appConfig.get("CHROMA_DB_PATH"))
            client = (chromadb.HttpClient(host=self.chromaDb_host, port=self.chromaDb_port))
            return client
        except Exception as e:
            raise Exception(e)

    def get_collection_name(self):
        return self.chromaDb_collection_name

    def get_collection (self, collection_name):
        embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=self.chromaDb_reader_embed_model
        )
        client = self.get_client()
        collection = client.get_collection(
            name=collection_name, embedding_function=embedding_func
        )
        return collection
    
chromadb_config = ChromaDbConfig()