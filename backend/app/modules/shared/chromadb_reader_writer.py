import uuid
from chromadb.utils import embedding_functions
from config.chromadb_config import chromadb_config
import asyncio

def chromadb_writer(txt_file_content):
    print("Writing to Chroma: Started...")
    chunk_size = 1000
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids = [str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    client = chromadb_config.get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name=chromadb_config.chromaDb_writer_embed_model)
    collection_name = chromadb_config.get_collection_name()
    try:
        collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
        collection.add(
            documents=txt_split,
            ids=ids,
            metadatas=metadata,
        )
        print("Writing to ChromaDB: Ended")
    except Exception as e:
        print(f"Error writing to ChromaDB: {str(e)}")
        raise Exception(e)

def chromadb_reader(question: str):
    client = chromadb_config.get_client()
    collection_name = chromadb_config.get_collection_name()
    collection = client.get_or_create_collection(collection_name)
    query_results = collection.query(
        query_texts=[question],
        n_results=1,
        include=["documents"]
    )
    return query_results["documents"][0]

#chromadb_pdf_writer(pdf_file_with_path=appConfig.get("KNOWLEDGE_PDF_LOCAL_PATH"))
#chromadb_wiki_writer("NISSAN LEAF")
#chromadb_txt_writer(txt_file_with_path=appConfig.get("KNOWLEDGE_TXT_LOCAL_PATH"))
#chromadb_docx_writer(doc_file_with_path=appConfig.get("KNOWLEDGE_DOC_LOCAL_PATH"))

#chromadb_writer("If none of the above steps resolved HTTP error 407, you may be dealing with a server-side "
#                "issue. If you have other sites on your server, you can check to see if they are experiencing "
#                "the same error. This will help confirm if the error is present on a particular site only or if "
#                "it’s originating on the server.Let’s look at a few troubleshooting steps to help you resolve error "
#                "407 on the server side.")

#result = chromadb_reader("tell me about pedestrian detection")
#print(f"result : {result}")