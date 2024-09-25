import io
import json
import traceback
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS
import utils.constants.error_messages as ERROR_MESSAGES
import utils.constants.success_messages as SUCCESS_MESSAGES
from modules.shared.chromadb_reader_writer import chromadb_writer
# import pandas as pd
# from docx import Document
# from PIL import Image
# import pytesseract  # For OCR
# import xml.etree.ElementTree as ET

class KnowledgeUploadService:
    def __init__(self):
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.CONFIG_COLLECTION]  # MongoDB collection

    async def getAiPrompts(self):
        try:
            agent_config = await self.collection.find_one({"name": "agent_config"})
            if agent_config is None:
                raise Exception(ERROR_MESSAGES.NOT_FOUND_ERROR)
            return json.loads(json.dumps(agent_config, default=str))
        except Exception as e:
            raise Exception(e)

    async def loadToChromadb(self, file_content):
        return_value = {"status": "success", "data": SUCCESS_MESSAGES.FILE_UPLOAD_SUCCESS}
        chromadb_writer(file_content)  # Writing to ChromaDB
        return return_value

    async def loadFileToChromadb(self, file):
        try:
            print("entering load_file_to_chromadb")
            filename = file.filename
            file_extension = filename.split(".")[-1].lower()

            data = await file.read()
            extracted_text = []

            # Handle PDF files
            if file_extension == 'pdf':
                try:
                    pdf_stream = io.BytesIO(data)
                    reader = PdfReader(pdf_stream, strict=False)
                    extracted_text = [page.extract_text() for page in reader.pages]
                except PdfReadError as e:
                    print(f"Error reading PDF: {e}")
                    return {"status": "error", "data": ERROR_MESSAGES.PDF_FILE_READ_ERROR}

            # Handle TXT files
            elif file_extension == 'txt':
                try:
                    txt_stream = io.StringIO(data.decode('utf-8'))
                    extracted_text.append(txt_stream.read())
                except UnicodeDecodeError:
                    try:
                        txt_stream = io.StringIO(data.decode('latin-1'))
                        extracted_text.append(txt_stream.read())
                    except Exception as e:
                        print(f"Error reading TXT file with fallback encoding: {e}")
                        return {"status": "error", "data": ERROR_MESSAGES.TXT_FILE_READ_ERROR}

            # Handle Word (DOCX) files
            # elif file_extension == 'docx':
            #     try:
            #         docx_stream = io.BytesIO(data)
            #         doc = Document(docx_stream)
            #         extracted_text = [para.text for para in doc.paragraphs]
            #     except Exception as e:
            #         print(f"Error reading DOCX file: {e}")
            #         return {"status": "error", "data": ERROR_MESSAGES.WORD_FILE_READ_ERROR}

            # Handle Excel files (XLSX, XLS, CSV)
            # elif file_extension in ['xlsx', 'xls', 'csv']:
            #     try:
            #         excel_stream = io.BytesIO(data)
            #         if file_extension == 'csv':
            #             df = pd.read_csv(excel_stream)
            #         else:
            #             df = pd.read_excel(excel_stream, engine='openpyxl' if file_extension == 'xlsx' else 'xlrd')
            #         extracted_text = df.to_string(index=False).split("\n")  # Convert DataFrame to text
            #     except Exception as e:
            #         print(f"Error reading Excel/CSV file: {e}")
            #         return {"status": "error", "data": ERROR_MESSAGES.EXCEL_FILE_READ_ERROR}

            # Handle Image files (JPEG, PNG, GIF, etc.) using OCR
            # elif file_extension in ['jpg', 'jpeg', 'png', 'gif']:
            #     try:
            #         image_stream = io.BytesIO(data)
            #         image = Image.open(image_stream)
            #         text = pytesseract.image_to_string(image)
            #         extracted_text.append(text)
            #     except Exception as e:
            #         print(f"Error reading image file: {e}")
            #         return {"status": "error", "data": ERROR_MESSAGES.IMAGE_FILE_READ_ERROR}

            # Handle XML files
            # elif file_extension == 'xml':
            #     try:
            #         xml_stream = io.BytesIO(data)
            #         tree = ET.parse(xml_stream)
            #         root = tree.getroot()
            #         extracted_text.append(ET.tostring(root, encoding='unicode'))
            #     except Exception as e:
            #         print(f"Error reading XML file: {e}")
            #         return {"status": "error", "data": ERROR_MESSAGES.XML_FILE_READ_ERROR}

            # Handle JSON files
            # elif file_extension == 'json':
            #     try:
            #         json_content = json.loads(data.decode('utf-8'))
            #         extracted_text.append(json.dumps(json_content, indent=4))
            #     except Exception as e:
            #         print(f"Error reading JSON file: {e}")
            #         return {"status": "error", "data": ERROR_MESSAGES.JSON_FILE_READ_ERROR}

            # Handle unsupported file types
            else:
                return {"status": "error", "data": ERROR_MESSAGES.FILE_SUPPORT_ERROR}

            # Combine the extracted content into a single string
            txt_content = " ".join(extracted_text)

            # Send the extracted text content to ChromaDB
            response = await self.loadToChromadb(txt_content)

            return response

        except Exception as e:
            traceback.print_exc()
            return {"status": "error", "data": str(e)}
