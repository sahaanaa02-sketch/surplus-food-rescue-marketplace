from datetime import datetime

from pydantic import BaseModel


class OfferBase(BaseModel):
    item: str
    description: str | None = None
    original_price: float
    discounted_price: float
    quantity: int
    pickup_location: str
    pickup_start: datetime
    pickup_end: datetime


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    item: str | None = None
    description: str | None = None
    original_price: float | None = None
    discounted_price: float | None = None
    quantity: int | None = None
    pickup_location: str | None = None
    pickup_start: datetime | None = None
    pickup_end: datetime | None = None


class OfferResponse(OfferBase):
    id: int
    offer_id: str
    business_owner_id: int

    class Config:
        from_attributes = True