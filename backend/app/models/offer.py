from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(String(50), unique=True, nullable=False, index=True)
    item = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    original_price = Column(Float, nullable=False)
    discounted_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    pickup_location = Column(String(255), nullable=False)
    pickup_start = Column(DateTime, nullable=False)
    pickup_end = Column(DateTime, nullable=False)
    business_owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    business_owner = relationship("User")