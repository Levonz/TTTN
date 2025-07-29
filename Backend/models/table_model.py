from pydantic import BaseModel, Field
from typing import Optional

class Table(BaseModel):
    id: Optional[str]  # <-- Để khớp với ObjectId được convert thành str
    label: str
    capacity: int
    status: str
