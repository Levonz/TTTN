from pydantic import BaseModel


class MenuItem(BaseModel):
    id: str
    name: str
    price: float
    category: str
    image: str
