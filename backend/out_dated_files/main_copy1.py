import asyncio

import langchain_community.chat_models.deepinfra
from fastapi import FastAPI
from config_Loader import get_configs
from key_vault_secret_loader import get_value_from_key_vault

config = get_configs()

tags_metadata = [
    {
        "name": "talk_to_openai_heartie",
        "description": "Simple call to openAI through API",
    },
    {
        "name": "talk_to_embedded_llama_heartie",
        "description": "Simple call to local embedded LLAMA",
    },
    {
        "name": "talk_to_embedded_rag_langchain_openai_wiki_heartie",
        "description": "Using Retreival Augmented Generation.  This uses wiki as a source which tokenizes the prompt and knowledge into a vectocized Chroma DB. "
                       "This is then used to hit OpenAI API to retrieve the results ",
        "externalDocs": {
            "description": "Some extrenal tags",
            "url": "https://change.com/",
        },
    },
    {
        "name": "talk_to_embedded_rag_langchain_openai_pdf_heartie",
        "description": "Using Retreival Augmented Generation.  This uses a local PDF (~600 pages) as a source which tokenizes the prompt and knowledge into a vectocized Chroma DB. "
                       "This is then used to hit OpenAI API to retrieve the results ",
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

@app.post("/talk_to_embedded_rag_langchain_openai_wiki_heartie/", tags=["talk_to_embedded_rag_langchain_openai_wiki_heartie"])
async def talk_to_embedded_rag_langchain_openai_wiki_heartie(prompt: str):
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
        persist_directory="db"
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


@app.post("/talk_to_embedded_rag_langchain_openai_pdf_heartie/", tags=["talk_to_embedded_rag_langchain_openai_pdf_heartie"])
async def talk_to_embedded_rag_langchain_openai_pdf_heartie(prompt: str, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_PATH")):
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
        persist_directory="db"
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


#wiki_prompt = "Tell me about the first generation of Nissan Leaf?"
#wiki_return_value = asyncio.run(talk_to_embedded_rag_langchain_openai_wiki_heartie(wiki_prompt))
#print(f"Return value from OpenAI with Wiki: {wiki_return_value}")
#df_prompt = "Can you explain regenerative break system?"
#pdf_return_value = asyncio.run(talk_to_embedded_rag_langchain_openai_pdf_heartie(pdf_prompt, pdf_knowledge_path=config.get("KNOWLEDGE_PDF_LOCAL_PATH")))
#print(f"Return value from OpenAI with Wiki: {pdf_return_value}")
