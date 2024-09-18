from datetime import datetime, timezone
import traceback
from fastapi import HTTPException
from utils.enums.shared_enum import EnrichmentStatus
from config.mongodb_config import mongo_config
import utils.constants.db_constants as DB_CONSTANTS

class EnrichmentRequestService:
    def __init__(self) -> None:
        self.db = mongo_config.get_db()
        self.collection = self.db[DB_CONSTANTS.ENRICHMENT_COLLECTION]
        
    async def updateEnrichmentDetails(self, id):
        try:
            body = {
                'ingested_on':  datetime.now(timezone.utc),
                'status': EnrichmentStatus.INGESTED.value
            }                  
            query = {
                "enrichment_id": id,
                "$or": [
                    {"deleted_dt": {"$exists": False}},
                    {"deleted_dt": None}
                ]
            }
            return self.collection.update_one(query, { "$set": body })            
        except Exception as e:
            traceback.print_exc()
            raise Exception(e)