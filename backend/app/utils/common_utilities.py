from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException, Response
from utils.enums.shared_enum import AgentType
from fastapi import status, HTTPException
import uuid
import chardet

def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.strftime(f"%B %d %Y %H:%M")
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, AgentType):
        return obj.value
    # Add custom serialization for other types if needed
    raise TypeError(f"Type {type(obj)} not serializable")

def internalServerError(e, response: Response):
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

import chardet

def read_file(file):
    try:
        # Read the raw bytes
        raw_data = file.file.read()
        
        # Automatically detect encoding
        result = chardet.detect(raw_data)
        encoding = result['encoding']
        
        # Fallback to 'utf-8' if detection fails
        if encoding is None:
            encoding = 'utf-8'
        
        # Decode using the detected or fallback encoding
        file_content = raw_data.decode(encoding, errors='replace')  # Using 'replace' to handle any decoding issues
        
        return file_content
    
    except Exception as e:
        print(f"Failed to read and decode file: {e}")
        return None
