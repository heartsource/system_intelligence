from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.mongodb_config import MONGO_DB, mongo_client
from modules.agents.agents_controller import router as agents_router
from modules.knowledge_upload.knowledge_upload_controller import router as knowledge_upload_router
from modules.hearty.hearty_controller import router as ask_hearty_router
from modules.logs.logs_controller import router as agents_logs_router

tags_metadata = [
    {
        "name": "load_to_chromadb",
        "description": "This endpoint is to load files to chroma to define context for the end user search.  This"
                       "Version can load Docx, Doc, txt, PDF or wiki.  "
                       "if Docx, Doc, txt, PDF please provide the type and the file name with path"
                       "if wiki context parameter is used to find the wiki to load. ",
        "externalDocs": {
            "description": "Some extrenal tags",
            "url": "https://change.com/",
        },
    },
    {
            "name": "talk_to_heartie",
        "description": "Using Retreival Augmented Generation.  This uses the chromadb used to do a semantic search "
                       "to contextualize the customer query before hitting the openai for results.  This endpoint uses"
                       "RAG (Retreival Augmented Generation) to make the results relevant to the context.",
        "externalDocs": {
                "description": "Some extrenal tags",
                "url": "https://change.com/",
        },
    },
]

# @asynccontextmanager
# async def app_lifespan(app: FastAPI):
#     async with mongo_client() as client:
#         if client is None:
#             raise HTTPException(status_code=500, detail="MongoDB client is None")
#         app.mongodb_client = client
#         app.mongodb = client.get_database(name=MONGO_DB)
#         yield
        
app = FastAPI(openapi_tags=tags_metadata)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(agents_router, prefix='/agents') # Agents Router
app.include_router(knowledge_upload_router) # Knowledge Upload Router
app.include_router(ask_hearty_router) # Ask Hearty Router
app.include_router(agents_logs_router, prefix='/logs')

