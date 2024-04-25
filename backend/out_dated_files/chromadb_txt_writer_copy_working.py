from langchain_community.vectorstores.chroma import Chroma

def read_product_descriptions(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        product_descriptions = file.readlines()
    print("read_product_description :",product_descriptions)
    return product_descriptions


def clean_read_product_descriptions(product_descriptions):
    clean_list = [item.strip() for item in product_descriptions]
    print("clean_read_product_descriptions :",clean_list)
    return clean_list

def write_product_descriptions(product_descriptions, chromadb_path, chromadb_name):
    import chromadb
    from chromadb.utils import embedding_functions

    import chromadb
    from chromadb.utils import embedding_functions

    CHROMA_DATA_PATH = chromadb_path
    EMBED_MODEL = "all-MiniLM-L6-v2"
    COLLECTION_NAME = chromadb_name

    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)

    collection = client.create_collection(name = COLLECTION_NAME,embedding_function = embedding_func,
                                          metadata = {"hnsw:space": "cosine"},)

    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    text_embeddings = model.encode(product_descriptions)
    print("write_product_descriptions : ",text_embeddings.shape)
    store = Chroma.from_documents(documents=product_descriptions, embedding=text_embeddings, persist_directory=chromadb_path)


def chromadb_txt_Writer(filename, chromadb_path, chromadb_name):
    file_content = read_product_descriptions(filename)
    clean_file_content = clean_read_product_descriptions(file_content)
    write_product_descriptions(clean_file_content, chromadb_path, chromadb_name)