import uuid
from chromadb.utils import embedding_functions
from config.chromadb_config import chromadb_config
import json
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError
import traceback
import os
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS

def chromadb_writer(txt_file_content):
    print("Writing to Chroma: Started...")
    chunk_size = 200
    # Split the data into chunks

    txt_split = [txt_file_content[i:i + chunk_size] for i in range(0, len(txt_file_content), chunk_size)]
    ids = [str(uuid.uuid4()) for arr in txt_split]
    metadata = [{"hnsw:space": f"cosine{i}"} for i in range(len(txt_split))]
    
    client = chromadb_config.get_client()
    if client is None:
        raise ValueError("ChromaDB client is not initialized. Please check the connection settings.")
    print("client", client)
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

async def loadToChromadb(file_content):
    return_value = {"status": "success", "data": APP_CONSTANTS.FILE_UPLOAD_SUCCESS}
    chromadb_writer(file_content)
    return return_value

async def loadFileToChromadb(file):
    try:
        print("entering load_file_to_chromadb")
        filename = file.filename
        file_extension = filename.split(".")[-1].lower()
        
        data = await file.read()
        save_to = f'temporary_file.{file_extension}'
        
        with open(save_to, 'wb') as f:
            f.write(data)

        pdf_text = []

        if file_extension == 'pdf':
            try:
                with open(save_to, 'rb') as f:
                    reader = PdfReader(f, strict=False)
                    for page in reader.pages:
                        content = page.extract_text()
                        pdf_text.append(content)
            except PdfReadError as e:
                print(f"Error reading PDF: {e}")
                return {"status": "error", "data": ERROR_CONSTANTS.PDF_FILE_READ_ERROR }
        
        elif file_extension == 'txt':
            try:
                with open(save_to, 'rt', encoding='utf-8') as f:
                    pdf_text.append(f.read())
            except UnicodeDecodeError:
                try:
                    with open(save_to, 'rt', encoding='latin-1') as f:
                        pdf_text.append(f.read())
                except Exception as e:
                    print(f"Error reading TXT file with fallback encoding: {e}")
                    return {"status": "error", "data": ERROR_CONSTANTS.TXT_FILE_READ_ERROR }
            except Exception as e:
                print(f"Error reading TXT file: {e}")
                return {"status": "error", "data": ERROR_CONSTANTS.TXT_FILE_READ_ERROR }
        
        else:
            return {"status": "error", "data": ERROR_CONSTANTS.FILE_SUPPORT_ERROR }

        if os.path.exists(save_to):
            os.remove(save_to)

        txt_content = " ".join(pdf_text)

        response = await loadToChromadb(txt_content)

        return response

    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "data": str(e)}
