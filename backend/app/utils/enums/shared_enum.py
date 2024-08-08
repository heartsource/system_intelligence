from enum import Enum


class AgentStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class Model(str, Enum):
    ChatGPT4 = 'ChatGPT4'
    Llama3 = 'Llama 3'
    Mistral = 'Mistral'

class Flow(str,Enum):
    RAG = 'RAG'
    FineTuning = 'Fine Tuning'

class SortOrder(Enum):
    ASC = 'asc'
    DESC = 'desc'

class AgentType(Enum):
    DEFAULT = 'default'
    CUSTOM = 'custom'

class EnrichmentStatus(Enum):
    INQUIRED = 'inquired'
    RESPONDED = 'responded'
    INJESTED = 'injested'