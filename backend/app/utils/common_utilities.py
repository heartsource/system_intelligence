from datetime import datetime
from bson import ObjectId
from utils.enums.shared_enum import AgentType


def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, AgentType):
        return obj.value
    # Add custom serialization for other types if needed
    raise TypeError(f"Type {type(obj)} not serializable")