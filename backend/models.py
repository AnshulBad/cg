from pydantic import BaseModel
from typing import List

class Scenario(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: int
    topic: str
    difficulty: int
    domain: str
    level: int
    status: str = "published"
