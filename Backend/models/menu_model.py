from pydantic import BaseModel
from typing import Optional

class Menu(BaseModel):
    name: str
    type: str  # 'food' hoặc 'drink'
    category: str  # 'beef', 'pork', ...
    price: float
    image: Optional[str] = None  # URL ảnh (nếu có)
