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
            self.chromaDb_host = os.getenv('CHROMA_HOST', "chroma-server")
            self.chromaDb_port = int(os.getenv('CHROMA_PORT', 8000))
            self.chromaDb_path = os.getenv('CHROMA_DB_PATH', "../chromadb")
            self.chromaDb_name = os.getenv('CHROMA_DB_NAME', "system_intelligence_chromadb")
            self.chromaDb_collection_name = os.getenv('CHROMA_DB_COLLECTION_NAME', "system_intelligence_collection")
            self.chromaDb_reader_embed_model = os.getenv('CHROMA_DB_READER_EMBED_MODEL', "all-mpnet-base-v2") # This is better trained
            self.chromaDb_writer_embed_model = os.getenv('CHROMA_DB_WRITER_EMBED_MODEL', "all-MiniLM-L6-v2") # This is better trained
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
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