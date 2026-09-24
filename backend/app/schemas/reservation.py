from datetime import datetime
from pydantic import BaseModel


class ReservationCreate(BaseModel):
    offer_id: int
    quantity: int


class ReservationResponse(BaseModel):
    id: int
    reservation_id: str
    offer_id: int
    customer_id: int
    quantity: int
    total_price: float
    signature: str | None = None
    status: str
    reserved_at: datetime

    class Config:
        from_attributes = True