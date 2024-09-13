from typing import List, Optional
from fastapi import APIRouter, Body, File, Form, Response, UploadFile, status

from utils.enums.shared_enum import EnrichmentStatus
from modules.enrichment.enrichment_service import EnrichmentRequestService
from utils.common_utilities import internalServerError
from modules.enrichment.enrichment_model import EnrichmentModel, EnrichmentListModel
import utils.constants.success_messages as SUCCESS_MESSAGES
import utils.constants.error_messages as ERROR_MESSAGES

router = APIRouter()
enrichment_request_service = EnrichmentRequestService()

@router.post('/')
async def create_enrichment_request(body: EnrichmentModel,response: Response):
    try:
        await enrichment_request_service.createEnrichmentRequest(body)
        response.status_code = status.HTTP_201_CREATED
        return { "status": "success", "data": SUCCESS_MESSAGES.ENRICHMENT_CREATED_SUCCESS}
    except Exception as e:
        return internalServerError(e, response)
    
@router.post('/fetch')
async def fetch_enrichment_requests(response: Response, body: EnrichmentListModel):
    try:
        enrichmentRequests = await enrichment_request_service.fetchEnrichmentRequests(body)
        if enrichmentRequests['data'] == None or enrichmentRequests['data'] == []:
            return { "status": "error", "data": ERROR_MESSAGES.NOT_FOUND_ERROR }
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": enrichmentRequests['data'], "totalRecords": enrichmentRequests['length'] }
    except Exception as e:
        return internalServerError(e, response)
    
@router.get('/{id}')
async def fetch_enrichment_details(id: int, response: Response):
        try:
            enrichmentDetails = await enrichment_request_service.fetchEnrichmentDetails(id)
            if enrichmentDetails is not None:
                response.status_code = status.HTTP_200_OK
                return { "status": "success", "data": enrichmentDetails }
            return { "status": "error", "data": ERROR_MESSAGES.NOT_FOUND_ERROR }
        except Exception as e:
            return internalServerError(e, response)
        
@router.put('/{enrichment_id}')
async def update_enrichment_details(
    enrichment_id: int, 
    response: Response,
    file: Optional[UploadFile] = File(None),
    payload: Optional[str] = Form(None), 

):
    try:
        enrichmentDetails = await enrichment_request_service.updateEnrichmentDetails(
            enrichment_id, 
            file, 
            payload
        )
        if enrichmentDetails is not None:
            response.status_code = status.HTTP_200_OK
            return {"status": "success", "data": SUCCESS_MESSAGES.ENRICHMENT_UPDATED_SUCCESS}
        return {"status": "error", "data": ERROR_MESSAGES.NOT_FOUND_ERROR}
    except Exception as e:
        return internalServerError(e, response)

@router.delete('/{enrichment_id}')
async def delete_enrichment_details(enrichment_id: int, response: Response):
        try:
            enrichmentDetails = await enrichment_request_service.deleteEnrichmentDetails(enrichment_id)
            if enrichmentDetails is not None:
                response.status_code = status.HTTP_200_OK
                return { "status": "success", "data": SUCCESS_MESSAGES.ENRICHMENT_DELETED_SUCCESS }
            return { "status": "error", "data": ERROR_MESSAGES.NOT_FOUND_ERROR }
        except Exception as e:
            return internalServerError(e, response)