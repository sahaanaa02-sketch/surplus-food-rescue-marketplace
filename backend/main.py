
from fastapi import FastAPI

from database import Base, engine

from app.models import User, Offer, Reservation

from app.routers.auth import router as auth_router
from app.routers.offers import router as offers_router
from app.routers.reservations import router as reservations_router
from app.routers.csv_import import router as csv_import_router
from app.routers.reports import router as reports_router
from app.routers.admin import router as admin_router


# ==================================================
# CREATE DATABASE TABLES
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="ZeroWasteBite - Surplus Food Rescue Marketplace",
    description="API for rescuing and reserving surplus food.",
    version="1.0.0"
)


# ==================================================
# INCLUDE ROUTERS
# ==================================================

app.include_router(auth_router)

app.include_router(offers_router)

app.include_router(reservations_router)

app.include_router(csv_import_router)

app.include_router(reports_router)

app.include_router(admin_router)


# ==================================================
# ROOT ENDPOINT
# ==================================================

@app.get("/")
def root():
    return {
        "message": "ZeroWasteBite API is running"
    }