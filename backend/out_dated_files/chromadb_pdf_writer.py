def chromadb_pdf_Writer(pdf_file_with_path=config.get("KNOWLEDGE_PDF_PATH"), chromadb_path=config.get("CHROMA_DB_PATH")):
    #from langchain_community.document_loaders import wikipedia
    from langchain_community.document_loaders import UnstructuredPDFLoader
    # from langchain.document_loaders import wikipedia
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    print("Started...")
    search_term = "Nissan Leaf owner manual"
    #docs = wikipedia.WikipediaLoader(query=search_term, load_max_docs=1).load()
    loader = UnstructuredPDFLoader(
        file_path=pdf_file_with_path,
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
