import os
import uuid
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault
config = get_configs()

def chromadb_writer(txt_file_content):
    print("Writting to CrhomaDB: Started...")
    from chromadb.utils import embedding_functions
    chunk_size = 200
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids = [str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    from langchain_community.vectorstores import Chroma

    EMBED_MODEL = "all-MiniLM-L6-v2"
    client = get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=EMBED_MODEL)
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
    collection.add(
        documents=txt_split,
        ids=ids,
        metadatas=metadata
    )
    print("Writting to CrhomaDB: Ended")

def chromadb_reader(question: str):
    client = get_client()
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(collection_name)
    query_results = collection.query(
        query_texts=[question],
        n_results=15,
        include=["documents"]
    )
    return query_results["documents"][0]

def get_client():
    try:
        import chromadb
        #client = chromadb.PersistentClient(path=config.get("CHROMA_DB_PATH"))
        chromaHost = ""
        chromaPort = ""
        try:
            chromaHost = os.environ['CHROMA_HOST']
            chromaPort = os.environ['CHROMA_PORT']
        except Exception:
            if chromaHost == "" or chromaPort == "":
                chromaHost = config.get("CHROMA_HOST")
                chromaPort = config.get("CHROMA_PORT")
        client = (chromadb.HttpClient(host=chromaHost, port=chromaPort))
        return client
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_collection_name():
    collection_name = config.get("CHROMA_DB_COLLECTION_NAME")
    #print("Collection name ", collection_name)
    return collection_name

def get_collection (collection_name):
    import chromadb
    EMBED_MODEL = "all-mpnet-base-v2"  # This is better trained
    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBED_MODEL
    )
    collection = client.get_collection(
        name=collection_name, embedding_function=embedding_func
    )
    return collection

#chromadb_pdf_writer(pdf_file_with_path=config.get("KNOWLEDGE_PDF_LOCAL_PATH"))
#chromadb_wiki_writer("NISSAN LEAF")
#chromadb_txt_writer(txt_file_with_path=config.get("KNOWLEDGE_TXT_LOCAL_PATH"))
#chromadb_docx_writer(doc_file_with_path=config.get("KNOWLEDGE_DOC_LOCAL_PATH"))

#chromadb_writer("If none of the above steps resolved HTTP error 407, you may be dealing with a server-side "
#                "issue. If you have other sites on your server, you can check to see if they are experiencing "
#                "the same error. This will help confirm if the error is present on a particular site only or if "
#                "it’s originating on the server.Let’s look at a few troubleshooting steps to help you resolve error "
#                "407 on the server side.")

#result = chromadb_reader("tell me about pedestrian detection")
#print(f"result : {result}")