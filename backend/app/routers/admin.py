from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from app.auth.security import decode_access_token
from app.models.user import User
from app.models.offer import Offer
from app.models.reservation import Reservation


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ==================================================
# CURRENT USER
# ==================================================

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


# ==================================================
# ADMIN CHECK
# ==================================================

def require_admin(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


# ==================================================
# GET ALL USERS
# ==================================================

@router.get("/users")
def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()

    return {
        "total_users": len(users),
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "is_active": user.is_active
            }
            for user in users
        ]
    }


# ==================================================
# ACTIVATE / DEACTIVATE USER
# ==================================================

@router.patch("/users/{user_id}/status")
def change_user_status(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Admin தன்னையே deactivate செய்யக்கூடாது
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot deactivate their own account"
        )

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "user_id": user.id,
        "username": user.username,
        "is_active": user.is_active
    }


# ==================================================
# ADMIN DASHBOARD SUMMARY
# ==================================================

@router.get("/summary")
def admin_summary(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()

    total_customers = db.query(User).filter(
        User.role == "customer"
    ).count()

    total_food_owners = db.query(User).filter(
        User.role == "food_owner"
    ).count()

    total_admins = db.query(User).filter(
        User.role == "admin"
    ).count()

    active_users = db.query(User).filter(
        User.is_active == True
    ).count()

    inactive_users = db.query(User).filter(
        User.is_active == False
    ).count()

    total_offers = db.query(Offer).count()

    total_reservations = db.query(
        Reservation
    ).count()

    reserved_count = db.query(
        Reservation
    ).filter(
        Reservation.status == "reserved"
    ).count()

    collected_count = db.query(
        Reservation
    ).filter(
        Reservation.status == "collected"
    ).count()

    cancelled_count = db.query(
        Reservation
    ).filter(
        Reservation.status == "cancelled"
    ).count()

    return {
        "report": "Admin Dashboard Summary",
        "users": {
            "total": total_users,
            "customers": total_customers,
            "food_owners": total_food_owners,
            "admins": total_admins,
            "active": active_users,
            "inactive": inactive_users
        },
        "marketplace": {
            "total_offers": total_offers,
            "total_reservations": total_reservations,
            "reserved": reserved_count,
            "collected": collected_count,
            "cancelled": cancelled_count
        }
    }