from enum import Enum

class EnrichmentStatus(Enum):
    INQUIRED = 'inquired'
    RESPONDED = 'responded'
    RESPONSE_UPDATED = 'response updated'
    INGESTED = 'ingested'