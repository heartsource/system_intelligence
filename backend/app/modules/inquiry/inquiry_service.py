from datetime import datetime
import json

from fastapi import HTTPException
from modules.knowledge_upload.knowledge_upload_service import KnowledgeUploadService
from utils.enums.shared_enum import InquiryStatus
from utils.common_utilities import custom_serializer
from modules.inquiry.inquiry_model import InquiryModel, InquiryListModel
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS
import utils.constants.error_constants as ERROR_CONSTANTS
import traceback
from pydantic.json import pydantic_encoder

knowledge_upload_service = KnowledgeUploadService()

class InquiryRequestService:
    def __init__(self) -> None:
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.INQUIRY_COLLECTION]

    async def get_next_sequence_value(self, sequence_name: str):
        result = await self.db[DB_CONSTANTS.COUNTERS_COLLECTION].find_one_and_update(
            {"type": sequence_name},
            {"$inc": {"sequence_value": 1}},
            return_document=True
        )
        return result["sequence_value"]

    async def createInquiryRequest(self, request: InquiryModel):
        try:
            inquiry_id = await self.get_next_sequence_value("inquiry")
            document = json.loads(json.dumps(request, default=pydantic_encoder))
            document["inquiry_id"] = inquiry_id
            document['requested_on'] = datetime.now()
            return await self.collection.insert_one(document)
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def fetchInquiryRequests(self, request: InquiryListModel):
        try:
            query = {}
            if request.status:
                formattedStatus = []
                for status in request.status:
                    formattedStatus.append(status.value)
                query['status'] = { "$in": formattedStatus }
            
            query['$or'] = [
                { 'deleted_dt': None },
                { 'deleted_dt': {'$exists': False}}
            ]

            sort_dict = None
            if request.sort_by:
                sort_order = -1 if request.sort_order.value.lower() == 'desc' else 1
                sort_dict = { request.sort_by : sort_order }

            # Ensure sort_dict is converted to list of tuples
            if isinstance(sort_dict, dict):
                sort_criteria = list(sort_dict.items())
            else:
                sort_criteria = sort_dict

            # set limit  and skip values
            limit = request.limit if request.limit else None
            skip = request.offset if request.offset else 0

            result = await self.collection.find(query).sort(sort_criteria).skip(skip).limit(limit).to_list(length=None)
            return json.loads(json.dumps(result, default=custom_serializer))
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        

    async def fetchInquiryDetails(self, id):
        try:
            query = {
                "inquiry_id": id,
                "$or": [
                    { "deleted_dt": { "$exists": False} },
                    { "deleted_dt": None }
                ]
            }
            inquiryDetails = await self.collection.find_one(query)

            if inquiryDetails is not None:
                inquiryDetails["_id"] = str(inquiryDetails["_id"])
                return inquiryDetails
            return None
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def updateInquiryDetails(self, id, file, query_response):
        try:
            if file == None and query_response == None:
                raise HTTPException(status_code=400, detail=ERROR_CONSTANTS.INQUIRY_UPDATE_ERROR)
            
            body = {
                "responded_on": datetime.now(),
                "status": InquiryStatus.INJESTED.value
            }
            if file:
                filename = file.filename
                body['response'] = f'File {filename} has been uploaded'
                await knowledge_upload_service.loadFileToChromadb(file)
            else:
                body['response'] = query_response
                await knowledge_upload_service.loadToChromadb(query_response)            
            query = {
                "inquiry_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            body['injested_on'] = datetime.now()
            return self.collection.find_one_and_update(query, { "$set": body })
            
            # if result is not None:
            #     # Convert ObjectId to string for JSON serialization
            #     result["_id"] = str(result["_id"])
            #     return result
            # return None
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def deleteInquiryDetails(self, id):
        try:
            
            query = {
                "inquiry_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            
            return await self.collection.find_one_and_update(query, { "$set": { "deleted_dt":datetime.now() } })

        except Exception as e:
            traceback.print_exc()
            raise Exception(e)