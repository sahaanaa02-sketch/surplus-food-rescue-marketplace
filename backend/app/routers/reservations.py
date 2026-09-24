from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from app.auth.security import decode_access_token
from app.models.user import User
from app.models.offer import Offer
from app.models.reservation import Reservation
from app.schemas.reservation import (
    ReservationCreate,
    ReservationResponse
)


router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    username = payload.get("sub")

    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


# =========================================================
# CREATE RESERVATION
# =========================================================

@router.post(
    "/",
    response_model=ReservationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_reservation(
    reservation_data: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # -----------------------------------------------------
    # Only customers can make reservations
    # -----------------------------------------------------

    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can make reservations"
        )

    # -----------------------------------------------------
    # Quantity validation
    # -----------------------------------------------------

    if reservation_data.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation quantity must be greater than zero"
        )

    # -----------------------------------------------------
    # Find offer
    # -----------------------------------------------------

    offer = db.query(Offer).filter(
        Offer.id == reservation_data.offer_id
    ).first()

    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found"
        )

    # -----------------------------------------------------
    # Check offer expiry
    # -----------------------------------------------------

    current_time = datetime.now()

    if current_time >= offer.pickup_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This offer has expired"
        )

    # -----------------------------------------------------
    # Calculate already reserved quantity
    #
    # Cancelled reservations are NOT counted.
    # -----------------------------------------------------

    existing_reservations = db.query(
        Reservation
    ).filter(
        Reservation.offer_id == offer.id,
        Reservation.status != "cancelled"
    ).all()

    reserved_quantity = sum(
        reservation.quantity
        for reservation in existing_reservations
    )

    # -----------------------------------------------------
    # Calculate available quantity
    # -----------------------------------------------------

    available_quantity = (
        offer.quantity - reserved_quantity
    )

    # -----------------------------------------------------
    # Prevent negative stock
    # -----------------------------------------------------

    if reservation_data.quantity > available_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {available_quantity} quantity available"
        )

    # -----------------------------------------------------
    # Calculate total price
    # -----------------------------------------------------

    total_price = (
        offer.discounted_price *
        reservation_data.quantity
    )

    # -----------------------------------------------------
    # Generate unique reservation ID
    # -----------------------------------------------------

    reservation_id = (
        f"RES-{uuid4().hex[:8].upper()}"
    )

    # -----------------------------------------------------
    # Generate reservation signature
    # -----------------------------------------------------

    signature = (
        f"{reservation_id}-"
        f"{current_user.id}-"
        f"{offer.id}"
    )

    # -----------------------------------------------------
    # Create reservation
    # -----------------------------------------------------

    new_reservation = Reservation(
        reservation_id=reservation_id,
        offer_id=offer.id,
        customer_id=current_user.id,
        quantity=reservation_data.quantity,
        total_price=total_price,
        signature=signature,
        status="reserved",
        reserved_at=current_time
    )

    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)

    return new_reservation


# =========================================================
# GET MY RESERVATIONS
# =========================================================

@router.get(
    "/my-reservations",
    response_model=list[ReservationResponse]
)
def get_my_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only customers can view their reservations"
        )

    reservations = db.query(
        Reservation
    ).filter(
        Reservation.customer_id == current_user.id
    ).all()

    return reservations