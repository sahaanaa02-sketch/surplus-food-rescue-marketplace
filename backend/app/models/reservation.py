from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(String(50), unique=True, nullable=False, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    signature = Column(String(255), nullable=True)
    status = Column(String(30), default="reserved")
    reserved_at = Column(DateTime, nullable=False)

    offer = relationship("Offer")
    customer = relationship("User")