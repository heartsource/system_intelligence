import json
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError
import traceback
import os
import json
from config_Loader import get_configs
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS
import utils.constants.error_constants as ERROR_CONSTANTS
import utils.constants.app_constants as APP_CONSTANTS

config = get_configs()

class KnowledgeUploadService:
    def __init__(self):
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.CONFIG_COLLECTION]

    async def getAiPrompts(self):
        try:
            agent_config = await self.collection.find_one({"name": "agent_config"})
            if agent_config is None:
                raise Exception(ERROR_CONSTANTS.NOT_FOUND_ERROR)
            return json.loads(json.dumps(agent_config, default=str))
        except Exception as e:
            raise Exception(e) 
    
    async def loadToChromadb(file_content):
        return_value = {"status": "success", "message": APP_CONSTANTS.FILE_UPLOAD_SUCCESS}
        from chromadb_reader_writer import chromadb_writer
        chromadb_writer(file_content)
        return return_value

    async def loadFileToChromadb(self, file):
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
                    return {"status": "error", "message": ERROR_CONSTANTS.PDF_FILE_READ_ERROR }
            
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
                        return {"status": "error", "message": ERROR_CONSTANTS.TXT_FILE_READ_ERROR }
                except Exception as e:
                    print(f"Error reading TXT file: {e}")
                    return {"status": "error", "message": ERROR_CONSTANTS.TXT_FILE_READ_ERROR }
            
            else:
                return {"status": "error", "message": ERROR_CONSTANTS.FILE_SUPPORT_ERROR }

            if os.path.exists(save_to):
                os.remove(save_to)

            txt_content = " ".join(pdf_text)

            response = await KnowledgeUploadService.loadToChromadb(txt_content)

            return response

        except Exception as e:
            traceback.print_exc()
            return {"status": "error", "message": str(e)}
    


#return_value = asyncio.run(load_file_to_chromadb("pdf", context="Nissan Leaf", file_path="../knowledge/2020-nissan-leaf-owner-manual.pdf"))
#return_value = asyncio.run(load_file_to_chromadb("wiki", context="Nissan Leaf", file_path="../knowledge/Derby_15_Jun_2023.pdf"))
#return_value = asyncio.run(load_file_to_chromadb("txt", context="Nissan Leaf", file_path="../knowledge/nissan_history.txt"))
#return_value = asyncio.run(load_file_to_chromadb("doc", context="Nissan Leaf", file_path="../knowledge/2023_leaf_warranty.docx"))
#return_value = asyncio.run(load_to_chromadb("This is a file content loaded from external sources"))