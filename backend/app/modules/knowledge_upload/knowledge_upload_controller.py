from fastapi import APIRouter
from modules.knowledge_upload.knowledge_upload_service import KnowledgeUploadService
from utils.common_utilities import internalServerError
from fastapi import Response, File, UploadFile

router = APIRouter()
knowledge_upload_service = KnowledgeUploadService()

@router.get("/get_ai_prompts/", tags=["get_ai_prompts"])
async def get_ai_prompts(response: Response):
    try:
        return await knowledge_upload_service.getAiPrompts()
    except Exception as e:
       return internalServerError(e, response)
    
@router.post("/load_to_chromadb/", tags=["load_to_chromadb"])
async def load_to_chromadb(file_content, response: Response):
    try:
        return await knowledge_upload_service.loadToChromadb(file_content)
    except Exception as e:
       return internalServerError(e, response)


@router.post("/load_file_to_chromadb/", tags=["load_file_to_chromadb"])
async def load_file_to_chromadb(response: Response, file: UploadFile = File(...)):
    try:
        return await knowledge_upload_service.loadFileToChromadb(file)
    except Exception as e:
       return internalServerError(e, response)
    