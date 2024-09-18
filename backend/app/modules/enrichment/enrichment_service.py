from datetime import datetime, timezone
import json
import traceback
from fastapi import HTTPException
from utils.enums.shared_enum import EnrichmentStatus
from utils.common_utilities import custom_serializer, read_file
from modules.enrichment.enrichment_model import EnrichmentModel, EnrichmentListModel
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS
import utils.constants.error_messages as ERROR_MESSAGES
import utils.constants.success_messages as SUCCESS_MESSAGES
import utils.constants.app_constants as APP_CONSTANTS
from pydantic.json import pydantic_encoder
from modules.shared.kafka_producer import produce_message
from bson import ObjectId
# knowledge_upload_service = KnowledgeUploadService()

class EnrichmentRequestService:
    def __init__(self) -> None:
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.ENRICHMENT_COLLECTION]

    async def get_next_sequence_value(self, sequence_name: str):
        result = await self.db[DB_CONSTANTS.COUNTERS_COLLECTION].find_one_and_update(
            {"type": sequence_name},
            {"$inc": {"sequence_value": 1}},
            return_document=True
        )
        return result["sequence_value"]

    async def createEnrichmentRequest(self, request: EnrichmentModel):
        try:
            enrichment_id = await self.get_next_sequence_value("enrichment")
            document = json.loads(json.dumps(request, default=pydantic_encoder))
            document['agent_id'] = ObjectId(document['agent_id'])
            document["enrichment_id"] = enrichment_id
            document['status'] = EnrichmentStatus.INQUIRED.value
            document['requested_on'] = datetime.now(timezone.utc)
            return await self.collection.insert_one(document)
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def fetchEnrichmentRequests(self, request: EnrichmentListModel):
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

            data_length = await self.collection.count_documents(query)

            result = await self.collection.find(query).sort(sort_criteria).skip(skip).limit(limit).to_list(length=None)
            return { "data": json.loads(json.dumps(result, default=custom_serializer)), "length": data_length }
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        

    async def fetchEnrichmentDetails(self, id):
        try:
            query = {
                "enrichment_id": id,
                "$or": [
                    { "deleted_dt": { "$exists": False} },
                    { "deleted_dt": None }
                ]
            }
            enrichmentDetails = await self.collection.find_one(query)

            if enrichmentDetails is not None:
                return json.loads(json.dumps(enrichmentDetails, default=custom_serializer))
            return None
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def updateEnrichmentDetails(self, id, file, query_response):
        try:
            if file == None and query_response == None:
                raise HTTPException(status_code=400, detail=ERROR_MESSAGES.ENRICHMENT_UPDATE_ERROR)
            exisitngRecord = await self.collection.find_one({"enrichment_id": id})
            body = {}
            if('responded_on' in exisitngRecord):
                body = {
                "responded_on": datetime.now(timezone.utc),
                "status": EnrichmentStatus.RESPONSE_UPDATED.value
                }
            else:
                body = {
                    "responded_on": datetime.now(timezone.utc),
                    "status": EnrichmentStatus.RESPONDED.value
                }
            data = {
                'enrichment_id' : id
            }
            if file and query_response:
                filename = file.filename
                body['response'] = query_response
                # await knowledge_upload_service.loadFileToChromadb(file)                
                # await knowledge_upload_service.loadToChromadb(query_response)
                file_content = read_file(file)
                data['message'] = file_content
                await produce_message(APP_CONSTANTS.KAFKA_TOPIC_NAME, data)
                del data['message']
                data['message'] = query_response
                await produce_message(APP_CONSTANTS.KAFKA_TOPIC_NAME, data) 
            elif file:
                filename = file.filename
                body['response'] = f'File {filename} has been uploaded'
                # await knowledge_upload_service.loadFileToChromadb(file)
                file_content = read_file(file)
                data['message'] = file_content
                await produce_message(APP_CONSTANTS.KAFKA_TOPIC_NAME, data)
            else:
                body['response'] = query_response
                data['message'] = query_response
                #await knowledge_upload_service.loadToChromadb(query_response)
                await produce_message(APP_CONSTANTS.KAFKA_TOPIC_NAME, data) 
                  
            query = {
                "enrichment_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            # body['ingested_on'] = datetime.now(timezone.utc)
            # body['status'] = EnrichmentStatus.INGESTED.value
            return self.collection.find_one_and_update(query, { "$set": body })
            
            # if result is not None:
            #     # Convert ObjectId to string for JSON serialization
            #     result["_id"] = str(result["_id"])
            #     return result
            # return None
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)
        
    async def deleteEnrichmentDetails(self, id):
        try:
            
            query = {
                "enrichment_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            
            return await self.collection.find_one_and_update(query, { "$set": { "deleted_dt":datetime.now(timezone.utc) } })

        except Exception as e:
            traceback.print_exc()
            raise Exception(e)