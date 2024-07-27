from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from utils.enums.shared_enum import AgentType
from fastapi import status, HTTPException
import uuid

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.strftime(f"%B %d %Y %H:%M")
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, AgentType):
        return obj.value
    # Add custom serialization for other types if needed
    raise TypeError(f"Type {type(obj)} not serializable")

def internalServerError(e, response):
    if e.args[0] and isinstance(e.args[0], HTTPException):
        response.status_code = e.args[0].status_code
        return { "status": "error", "data": e.args[0].detail}
    response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return { "status": "error", "data": str(e)}

def is_valid_uuid(uuid_string):
    try:
        val = uuid.UUID(uuid_string, version=4)
    except ValueError:
        return False
    
    return val.hex == uuid_string.replace('-', '')