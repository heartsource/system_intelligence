import asyncio
import os

import langchain_community.chat_models.deepinfra
import openai
from fastapi import FastAPI
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault
from openai import OpenAI
from chromadb.utils import embedding_functions
from fastapi.exceptions import HTTPException
import uuid


config = get_configs()

tags_metadata = [
    {
        "name": "talk_to_heartie_wiki",
        "description": "Using Retreival Augmented Generation.  This uses wiki as a source which tokenizes the prompt and knowledge into a vectocized Chroma DB. "
                       "This is then used to hit OpenAI API to retrieve the results ",
        "externalDocs": {
            "description": "Some extrenal tags",
            "url": "https://change.com/",
        },
    },
    {
        "name": "talk_to_heartie_pdf",
        "description": "Using Retreival Augmented Generation.  This uses a local PDF (~600 pages) as a source which tokenizes the prompt and knowledge into a vectocized Chroma DB. "
                       "This is then used to hit OpenAI API to retrieve the results ",
        "externalDocs": {
            "description": "Some extrenal tags",
            "url": "https://change.com/",
        },
    },
    {
            "name": "talk_to_heartie",
            "description": "Using Retreival Augmented Generation.  Loading into chroma DB is outside the scope of this API"
                           "This is then used to hit OpenAI API in azure to retrieve the results ",
            "externalDocs": {
                "description": "Some extrenal tags",
                "url": "https://change.com/",
        },
    },
]
app = FastAPI(openapi_tags=tags_metadata)

@app.get("/")
async def root():
    return {"message": "Hello1 World"}

@app.post("/talk_to_heartie_wiki/", tags=["talk_to_heartie_wiki"])
async def talk_to_heartie_wiki(prompt: str, chromadb_path=config.get("CHROMA_DB_PATH")):
    from langchain_community.document_loaders import wikipedia
    #from langchain.document_loaders import wikipedia
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    print("Started...")
    search_term = "Nissan Leaf EV"
    docs = wikipedia.WikipediaLoader(query=search_term, load_max_docs=1).load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False
    )
    data = text_splitter.split_documents(docs)
    print(data[:3])

    from langchain_community.vectorstores import Chroma
    #from langchain_community.embeddings import OpenAIEmbeddings
    from langchain_openai import OpenAIEmbeddings

    openai_api_key = get_value_from_key_vault(config.get("OPEN_AI_API_KEY"))

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    store = Chroma.from_documents(
        data,
        embeddings,
        ids=[f"{item.metadata['source']}-{index}" for index, item in enumerate(data)],
        collection_name="Nissan-Leaf-EV-Embeddings",
        persist_directory=chromadb_path
    )
    store.persist()

    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    #from langchain_community.chat_models import ChatOpenAI
    from langchain_openai import ChatOpenAI

    template = """you are a bot that answers question about electric vehicle Nissan leaf, using only the context provided.
    if you dont know the answer, simply state that you dont know.
    
    {context}
    
    Questions:  {question}"""

    PROMPT = PromptTemplate(
        template=template,
        input_variables=["context", "question"]
    )

    llm = ChatOpenAI(openai_api_key=openai_api_key, temperature=0, model="gpt-4")

    qa_with_source = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=store.as_retriever(),
    chain_type_kwargs={"prompt": PROMPT},
    return_source_documents = True
    )

#    print(qa_with_source.invoke("Can you explain regenerative break system?"))
    return_value = qa_with_source.invoke(prompt)
    print("Ended...")
    return return_value


@app.post("/talk_to_heartie_pdf/", tags=["talk_to_heartie_pdf"])
async def talk_to_heartie_pdf(prompt: str, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_PATH"), chromadb_path=config.get("CHROMA_DB_PATH")):
    #from langchain_community.document_loaders import wikipedia
    from langchain_community.document_loaders import UnstructuredPDFLoader
    # from langchain.document_loaders import wikipedia
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    print("Started...")
    search_term = "Nissan Leaf owner manual"
    #docs = wikipedia.WikipediaLoader(query=search_term, load_max_docs=1).load()
    loader = UnstructuredPDFLoader(
        file_path=pdf_knowledge_path,
        model_path="elements",
        strategy="fast"
    )
    docs = loader.load()
    print(f"The document created")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False
    )
    data = text_splitter.split_documents(docs)
    print("Data is split into chunks")

    from langchain_community.vectorstores import Chroma
    # from langchain_community.embeddings import OpenAIEmbeddings
    from langchain_openai import OpenAIEmbeddings

    openai_api_key = get_value_from_key_vault(config.get("OPEN_AI_API_KEY"))

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    store = Chroma.from_documents(
        data,
        embeddings,
        ids=[f"{item.metadata['source']}-{index}" for index, item in enumerate(data)],
        collection_name="Nissan-Leaf-owner-manual-Embeddings",
        persist_directory=chromadb_path
    )
    store.persist()

    from langchain.chains import RetrievalQA
    from langchain.prompts import PromptTemplate
    # from langchain_community.chat_models import ChatOpenAI
    from langchain_openai import ChatOpenAI

    template = """you are a bot that answers question about electric vehicle Nissan Leaf, using only the context provided.
    if you dont know the answer, simply state that you dont know.

    {context}

    Questions:  {question}"""

    PROMPT = PromptTemplate(
        template=template,
        input_variables=["context", "question"]
    )

    llm = ChatOpenAI(openai_api_key=openai_api_key, temperature=0, model="gpt-4")

    qa_with_source = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=store.as_retriever(),
        chain_type_kwargs={"prompt": PROMPT},
        return_source_documents=True
    )

    #print(qa_with_source.invoke("Can you explain regenerative break system?"))
    return_value = qa_with_source.invoke(prompt)
    print("Ended...")
    return return_value

def read_file(file_path):
    # Check file extension and read content accordingly
    if file_path.endswith('.pdf'):
        return read_pdf(file_path)
    elif file_path.endswith('.txt'):
        return read_text(file_path)
    elif file_path.endswith('.doc'):
        return read_docx(file_path)
    else:
        raise ValueError("Unsupported file format")

def read_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)
    return '\n'.join(full_text)


def read_pdf(file_path):
    from PyPDF4 import PdfFileReader
    text = ""
    with open(file_path, 'rb') as file:
        reader = PdfFileReader(file)
        for page_num in range(reader.numPages):
            page = reader.getPage(page_num)
            text += page.extractText()
    return text


def read_text(file_path):
    # Open and read the text file
    with open(file_path, 'r') as file:
        return file.read()

def read_file(file_path):
    # Check file extension and read content accordingly
    if file_path.endswith('.pdf'):
        return read_pdf(file_path)
    elif file_path.endswith('.txt'):
        return read_text(file_path)
    elif file_path.endswith('.doc'):
        return read_doc(file_path)
    else:
        raise ValueError("Unsupported file format")

@app.post("/loaa_doc_to_chromadb/", tags=["loaa_doc_to_chromadb"])
async def load_file_to_chromadb(filename_with_path: str, chromadb_path=config.get("CHROMA_DB_PATH"), chromadb_name=config.get("CHROMA_DB_NAME")):
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    # unpacking the tuple
    return_value = True

    file_content = read_file(filename_with_path)
    #file_content_clean = clean_content(file_content)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=20,
        length_function=len,
        is_separator_regex=False
    )
    content_split = text_splitter.split_documents(file_content)
    print(f"Data is split into chunks {type(content_split)}")
    ids=[str(uuid.uuid4()) for arr in content_split]
    write_to_chromadb(ids, content_split, chromadb_path, chromadb_name)
    return return_value

def write_to_chromadb(ids, content_split, chromadb_path, chromadb_name):
    import chromadb
    from chromadb.utils import embedding_functions

    CHROMA_DATA_PATH = chromadb_path
    EMBED_MODEL = "all-MiniLM-L6-v2"
    #COLLECTION_NAME = config.get("COLLECTION_NAME")

    client = chromadb.PersistentClient(path=CHROMA_DATA_PATH)

    embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name = EMBED_MODEL)

    collection = client.get_or_create_collection(name = config.get("COLLECTION_NAME") ,embedding_function = embedding_func,
                                          metadata = {"hnsw:space": "cosine"},)

    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("all-MiniLM-L6-v2")
    text_embeddings = model.encode(content_split)
    print("text_embeddings : ",text_embeddings.shape)
    #collection = client.get_or_create_collection(name=collection_name, embedding_function=text_embeddings)
    collection.add(ids=ids, documents=content_split)
    #store = Chroma.from_documents(documents=product_descriptions, embedding=text_embeddings, persist_directory=chromadb_path)






def get_txt_content(filename_with_path):
    content=""
    with open(filename_with_path, 'r', encoding='utf-8') as file:
        content = file.read()
    print("content :",content)
    return content

def get_pdf_content(filename_with_path):
    # from langchain_community.document_loaders import wikipedia
    from langchain_community.document_loaders import UnstructuredPDFLoader
    # from langchain.document_loaders import wikipedia
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    print("Started...")
    search_term = "Nissan Leaf owner manual"
    loader = UnstructuredPDFLoader(
        file_path=pdf_knowledge_path,
        model_path="elements",
        strategy="fast"
    )
    content = loader.load()
    print(f"content : {content}")

    return content

def clean_content(content):
    clean_content_list = [item.strip() for item in content]
    print("clean_read_product_descriptions :",clean_content_list)
    return clean_content_list

#wiki_prompt = "Tell me about the first generation of Nissan Leaf?"
#wiki_return_value = asyncio.run(talk_to_heartie_wiki(wiki_prompt, chromadb_path=config.get("CHROMA_DB_LOCAL_PATH")))
#print(f"Return value from OpenAI with Wiki: {wiki_return_value}")
#pdf_prompt = "Can you explain regenerative break system?"
#pdf_return_value = asyncio.run(talk_to_heartie_pdf(pdf_prompt, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_LOCAL_PATH"), chromadb_path=config.get("CHROMA_DB_LOCAL_PATH")))
#print(f"Return value from OpenAI with Wiki: {pdf_return_value}")


#get_vector_dataset("This is test")
#prompt = "Can you explain regenerative break system?"
#return_value = asyncio.run(talk_to_heartie(prompt, chromadb_path=config.get("CHROMA_DB_LOCAL_PATH")))
#print(f"Return value from Azure  OpenAI: {return_value}")

return_value = asyncio.run(load_file_to_chromadb("../../knowledge/Derby_15_Jun_2023.pdf", chromadb_path=config.get("CHROMA_DB_LOCAL_PATH"), chromadb_name=config.get("CHROMA_DB_NAME")))



