from config_Loader import get_configs
config = get_configs()

def get_client():
    import chromadb
    client = (chromadb.HttpClient(
        host=config.get("CHROMA_HOST"),
        port=config.get("CHROMA_PORT")
    ))
    return client

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

def get_collection_name():
    collection_name = config.get("CHROMA_DB_COLLECTION_NAME")
    print("Collection name ", collection_name)
    return collection_name

result = chromadb_reader("What is leaf?")
print("The result received is : ",result)


