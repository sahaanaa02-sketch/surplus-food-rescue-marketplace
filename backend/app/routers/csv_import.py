import csv
import io
from datetime import datetime
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from app.auth.security import decode_access_token
from app.models.user import User
from app.models.offer import Offer


router = APIRouter(
    prefix="/csv",
    tags=["CSV Import"]
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
            detail="Invalid or expired token"
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
@router.post("/offers")
async def import_offers_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Food Owner மட்டும் CSV upload செய்யலாம்
    if current_user.role != "food_owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food business owners can import offers"
        )

    # CSV file மட்டும் allow
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are allowed"
        )

    # File read
    contents = await file.read()

    try:
        decoded = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV must be UTF-8 encoded"
        )

    # CSV reader
    reader = csv.DictReader(
        io.StringIO(decoded)
    )

    # Required columns
    required_columns = {
        "item",
        "description",
        "original_price",
        "discounted_price",
        "quantity",
        "pickup_location",
        "pickup_start",
        "pickup_end"
    }

    # Column validation
    if not required_columns.issubset(
        set(reader.fieldnames or [])
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CSV contains missing required columns"
        )

    imported_count = 0

    try:
        for row in reader:

            # Convert CSV values
            original_price = float(
                row["original_price"]
            )

            discounted_price = float(
                row["discounted_price"]
            )

            quantity = int(
                row["quantity"]
            )

            pickup_start = datetime.fromisoformat(
                row["pickup_start"]
            )

            pickup_end = datetime.fromisoformat(
                row["pickup_end"]
            )

            # Quantity validation
            if quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Quantity must be greater than zero"
                )

            # Price validation
            if discounted_price >= original_price:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Discounted price must be lower than original price"
                )

            # Pickup time validation
            if pickup_end <= pickup_start:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Pickup end must be after pickup start"
                )

            # Expiry validation
            if pickup_end <= datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Pickup end time must be in the future"
                )

            # Create offer
            new_offer = Offer(
                offer_id=f"OFR-{uuid4().hex[:8].upper()}",
                item=row["item"],
                description=row["description"],
                original_price=original_price,
                discounted_price=discounted_price,
                quantity=quantity,
                pickup_location=row["pickup_location"],
                pickup_start=pickup_start,
                pickup_end=pickup_end,
                business_owner_id=current_user.id
            )

            db.add(new_offer)

            imported_count += 1

        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except (ValueError, KeyError):
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid CSV data format"
        )

    return {
        "message": "CSV offers imported successfully",
        "imported_count": imported_count
    }