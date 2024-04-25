import uuid
import pdfplumber
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault
config = get_configs()



def chromadb_pdf_writer(pdf_file_with_path=config.get("KNOWLEDGE_PDF_PATH")):
    import chromadb
    from chromadb.utils import embedding_functions
    txt_file_content = ""
    with pdfplumber.open(pdf_file_with_path) as pdf:
        for page in pdf.pages:
            txt_file_content += page.extract_text()

    chunk_size = 200
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids=[str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    from langchain_community.vectorstores import Chroma

    EMBED_MODEL = "all-MiniLM-L6-v2"
    client = get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
    collection.add(
        documents=txt_split,
        ids=ids,
        metadatas=metadata
    )

#    from langchain_community.document_loaders import UnstructuredPDFLoader
#    from langchain.text_splitter import RecursiveCharacterTextSplitter

#    print("PDF Load Started...")
#    loader = UnstructuredPDFLoader(
#        file_path=pdf_file_with_path,
#        model_path="elements",
#        strategy="fast"
#    )
#    docs = loader.load()
#    #print(f"The document created {docs}")

#    text_splitter = RecursiveCharacterTextSplitter(
#        chunk_size=100,
#        chunk_overlap=20,
#        length_function=len,
#        is_separator_regex=False
#    )
#    data_split = text_splitter.split_documents(docs)
#    print("Data is split into chunksss")
#    data_split_content = [doc.page_content for doc in data_split]
#    ids = [f"id:{uuid.uuid4()}{i}" for i in range(len(data_split_content))]
#    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(data_split_content))]

#    from langchain_community.vectorstores import Chroma
#    from langchain_openai import OpenAIEmbeddings

#    EMBED_MODEL = "all-MiniLM-L6-v2"
#    client = get_client()

#    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
#    collection_name = get_collection_name()
#    collection = client.get_or_create_collection(collection_name, embedding_function=embedding_func)
#    collection.add(
#        documents=data_split_content,
#        ids=ids,
#        metadatas=metadata
#    )
    print("Ended...")

def chromadb_wiki_writer(context):
    import chromadb
    import wikipedia

    from chromadb.utils import embedding_functions
    #from langchain_community.document_loaders import wikipedia
    #from langchain.text_splitter import RecursiveCharacterTextSplitter

    #docs = wikipedia.WikipediaLoader(query=context, load_max_docs=1).load()
    #print(f"The document created {docs}")
    wikipedia.set_lang("en")
    wiki_title = wikipedia.search(context)
    print(wiki_title)
    txt_file_content = ""
    for title in wiki_title:
        txt_content = ""
        print(title)
        try:
            print("Try block", title)
            txt_content = wikipedia.page(title).content
            print(txt_content)
        except:
            print("Exception Block")
        else:
            print("Else block")
        finally:
            print("Finally block")
        print("----------------------------")
        txt_file_content+=txt_content
#    print(txt_file_content)

    chunk_size = 200
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids=[str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    from langchain_community.vectorstores import Chroma

    EMBED_MODEL = "all-MiniLM-L6-v2"
    client = get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
    collection.add(
        documents=txt_split,
        ids=ids,
        metadatas=metadata
    )



#    text_splitter = RecursiveCharacterTextSplitter(
#        chunk_size=100,
#        chunk_overlap=20,
#        length_function=len,
#        is_separator_regex=False
#    )
#    data_split = text_splitter.split_documents(docs)
#    #print(f"Data is split into chunksss {data_split}")
#    data_split_content = [doc.page_content for doc in data_split]
#    ids = [f"id:{uuid.uuid4()}{i}" for i in range(len(data_split_content))]
#    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(data_split_content))]
#
#    from langchain_community.vectorstores import Chroma
#
#    EMBED_MODEL = "all-MiniLM-L6-v2"
#    client = get_client()
#
#    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
#    collection_name = get_collection_name()
#    collection = client.get_or_create_collection(collection_name, embedding_function=embedding_func)
#     collection.add(
#        documents=data_split_content,
#        ids=ids,
#        metadatas=metadata
#    )
    print("Ended...")
    
def chromadb_txt_writer(txt_file_with_path=config.get("KNOWLEDGE_TXT_PATH")):
    import chromadb
    from chromadb.utils import embedding_functions

    txtFile_content = open(txt_file_with_path).read()

    chunk_size = 200
    # Split the data into chunks

    txt_split = [txtFile_content[i:i + chunk_size] for i in range(0, len(txtFile_content), chunk_size)]
    ids=[str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    from langchain_community.vectorstores import Chroma

    EMBED_MODEL = "all-MiniLM-L6-v2"
    client = get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
    collection.add(
        documents=txt_split,
        ids=ids,
        metadatas=metadata
    )
    print("Ended...")


def chromadb_docx_writer(doc_file_with_path=config.get("KNOWLEDGE_DOC_PATH"), chromadb_path=config.get("CHROMA_DB_PATH")):
    import docx2txt
    from chromadb.utils import embedding_functions
    txt_file_content = docx2txt.process(doc_file_with_path)

    chunk_size = 200
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids=[str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]

    from langchain_community.vectorstores import Chroma

    EMBED_MODEL = "all-MiniLM-L6-v2"
    client = get_client()

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
    collection_name = get_collection_name()
    collection = client.get_or_create_collection(name=collection_name, embedding_function=embedding_func)
    collection.add(
        documents=txt_split,
        ids=ids,
        metadatas=metadata
    )
    print("Ended...")

def chromadb_writer(txt_file_content):
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
    print("Ended...")

#    from chromadb.utils import embedding_functions
#    from langchain_community.document_loaders import Docx2txtLoader
#    from langchain.text_splitter import RecursiveCharacterTextSplitter

#    doc_content = Docx2txtLoader(doc_file_with_path).load()
#    #print(f"The document created {doc_content}")
#    text_content = doc_content[0].page_content
#    chunk_size = 200
#    # Split the data into chunks
#
#    txt_split = [text_content[i:i + chunk_size] for i in range(0, len(text_content), chunk_size)]
#    ids=[str(uuid.uuid4()) for arr in txt_split]
#    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]
#
#    from langchain_community.vectorstores import Chroma
#
#    EMBED_MODEL = "all-MiniLM-L6-v2"
#    client = get_client()
#
#    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)
#    collection_name = get_collection_name()
#    collection = client.get_or_create_collection(collection_name, embedding_function=embedding_func)
#    collection.add(
#        documents=txt_split,
#        ids=ids,
#        metadatas=metadata
#    )
#    print("Ended...")


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
    import chromadb
    #client = chromadb.PersistentClient(path=config.get("CHROMA_DB_PATH"))
    client = (chromadb.HttpClient(host=config.get("CHROMA_HOST"), port=config.get("CHROMA_PORT")))
    return client

def get_collection_name():
    collection_name = config.get("CHROMA_DB_COLLECTION_NAME")
    print("Collection name ", collection_name)
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