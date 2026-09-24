
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from app.auth.security import decode_access_token
from app.models.user import User
from app.models.offer import Offer
from app.schemas.offer import OfferCreate, OfferUpdate, OfferResponse


router = APIRouter(
    prefix="/offers",
    tags=["Offers"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


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


@router.get(
    "/",
    response_model=list[OfferResponse]
)
def get_available_offers(
    db: Session = Depends(get_db)
):
    current_time = datetime.now()

    offers = db.query(Offer).filter(
        Offer.pickup_end > current_time
    ).all()

    return offers


@router.post(
    "/",
    response_model=OfferResponse,
    status_code=status.HTTP_201_CREATED
)
def create_offer(
    offer_data: OfferCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "food_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food business owners can create offers"
        )

    if offer_data.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than zero"
        )

    if offer_data.discounted_price >= offer_data.original_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discounted price must be lower than original price"
        )

    if offer_data.pickup_end <= offer_data.pickup_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup end time must be after pickup start time"
        )

    if offer_data.pickup_end <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup end time must be in the future"
        )

    offer_id = f"OFR-{uuid4().hex[:8].upper()}"

    new_offer = Offer(
        offer_id=offer_id,
        item=offer_data.item,
        description=offer_data.description,
        original_price=offer_data.original_price,
        discounted_price=offer_data.discounted_price,
        quantity=offer_data.quantity,
        pickup_location=offer_data.pickup_location,
        pickup_start=offer_data.pickup_start,
        pickup_end=offer_data.pickup_end,
        business_owner_id=current_user.id
    )

    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)

    return new_offer


@router.get(
    "/my-offers",
    response_model=list[OfferResponse]
)
def get_my_offers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "food_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food business owners can view their offers"
        )

    offers = db.query(Offer).filter(
        Offer.business_owner_id == current_user.id
    ).all()

    return offers


@router.put(
    "/{offer_id}",
    response_model=OfferResponse
)
def update_offer(
    offer_id: str,
    offer_data: OfferUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "food_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food business owners can update offers"
        )

    offer = db.query(Offer).filter(
        Offer.offer_id == offer_id
    ).first()

    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found"
        )

    if offer.business_owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own offers"
        )

    update_data = offer_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(offer, field, value)

    if offer.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than zero"
        )

    if offer.discounted_price >= offer.original_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Discounted price must be lower than original price"
        )

    if offer.pickup_end <= offer.pickup_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup end time must be after pickup start time"
        )

    if offer.pickup_end <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup end time must be in the future"
        )

    db.commit()
    db.refresh(offer)

    return offer


@router.delete(
    "/{offer_id}"
)
def delete_offer(
    offer_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "food_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food business owners can delete offers"
        )

    offer = db.query(Offer).filter(
        Offer.offer_id == offer_id
    ).first()

    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Offer not found"
        )

    if offer.business_owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own offers"
        )

    db.delete(offer)
    db.commit()

    return {
        "message": "Offer deleted successfully",
        "offer_id": offer_id
    }





