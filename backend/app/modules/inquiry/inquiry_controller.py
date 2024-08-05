from typing import List, Optional
from fastapi import APIRouter, Body, File, Form, Response, UploadFile, status

from utils.enums.shared_enum import InquiryStatus
from modules.inquiry.inquiry_service import InquiryRequestService
from utils.common_utilities import internalServerError
from modules.inquiry.inquiry_model import InquiryModel, InquiryListModel, InquiryUpdateModel
import utils.constants.app_constants as APP_CONSTANTS
import utils.constants.error_constants as ERROR_CONSTANTS

router = APIRouter()
inquiry_request_service = InquiryRequestService()

@router.post('/')
async def create_inquiry_request(body: InquiryModel,response: Response):
    try:
        await inquiry_request_service.createInquiryRequest(body)
        response.status_code = status.HTTP_201_CREATED
        return { "status": "success", "data": APP_CONSTANTS.INQUIRY_CREATED_SUCCESS}
    except Exception as e:
        return internalServerError(e, response)
    
@router.post('/fetch')
async def fetch_inquiry_requests(response: Response, body: InquiryListModel):
    try:
        inquiryRequests = await inquiry_request_service.fetchInquiryRequests(body)
        if inquiryRequests == None or inquiryRequests == []:
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        response.status_code = status.HTTP_200_OK
        return { "status": "success", "data": inquiryRequests }
    except Exception as e:
        return internalServerError(e, response)
    
@router.get('/{id}')
async def fetch_inquiry_details(id: int, response: Response):
        try:
            inquiryDetails = await inquiry_request_service.fetchInquiryDetails(id)
            if inquiryDetails is not None:
                response.status_code = status.HTTP_200_OK
                return { "status": "success", "data": inquiryDetails }
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        except Exception as e:
            return internalServerError(e, response)
        
@router.put('/{inquiry_id}')
async def update_inquiry_details(
    inquiry_id: int, 
    response: Response,
    file: Optional[UploadFile] = File(None),
    payload: Optional[str] = Form(None), 

):
    try:
        inquiryDetails = await inquiry_request_service.updateInquiryDetails(
            inquiry_id, 
            file, 
            payload
        )
        if inquiryDetails is not None:
            response.status_code = status.HTTP_200_OK
            return {"status": "success", "data": APP_CONSTANTS.INQUIRY_UPDATED_SUCCESS}
        return {"status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR}
    except Exception as e:
        return internalServerError(e, response)

@router.delete('/{inquiry_id}')
async def delete_inquiry_details(inquiry_id: int, response: Response):
        try:
            inquiryDetails = await inquiry_request_service.deleteInquiryDetails(inquiry_id)
            if inquiryDetails is not None:
                response.status_code = status.HTTP_200_OK
                return { "status": "success", "data": APP_CONSTANTS.INQUIRY_DELETED_SUCCESS }
            return { "status": "error", "data": ERROR_CONSTANTS.NOT_FOUND_ERROR }
        except Exception as e:
            return internalServerError(e, response)