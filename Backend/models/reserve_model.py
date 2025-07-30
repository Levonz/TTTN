from pydantic import BaseModel


class ReservationRequest(BaseModel):
    customer_name: str
    phone: str
