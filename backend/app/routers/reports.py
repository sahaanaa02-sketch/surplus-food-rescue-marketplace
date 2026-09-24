import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from database import get_db
from app.models.user import User
from app.models.offer import Offer
from app.models.reservation import Reservation


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ==================================================
# REPORT 1
# Surplus Sales / Rescue Summary
# ==================================================

def get_summary_data(db: Session):

    offers = db.query(Offer).all()
    reservations = db.query(Reservation).all()

    total_offers = len(offers)

    total_food_quantity = sum(
        offer.quantity
        for offer in offers
    )

    total_reservations = len(reservations)

    reserved_quantity = sum(
        reservation.quantity
        for reservation in reservations
        if reservation.status == "reserved"
    )

    collected_quantity = sum(
        reservation.quantity
        for reservation in reservations
        if reservation.status == "collected"
    )

    cancelled_quantity = sum(
        reservation.quantity
        for reservation in reservations
        if reservation.status == "cancelled"
    )

    total_sales = sum(
        reservation.total_price
        for reservation in reservations
        if reservation.status == "collected"
    )

    return {
        "total_offers": total_offers,
        "total_food_quantity": total_food_quantity,
        "total_reservations": total_reservations,
        "reserved_quantity": reserved_quantity,
        "collected_quantity": collected_quantity,
        "cancelled_quantity": cancelled_quantity,
        "total_sales": total_sales
    }


@router.get("/summary")
def surplus_sales_summary(
    db: Session = Depends(get_db)
):
    data = get_summary_data(db)

    return {
        "report": "Surplus Sales / Rescue Summary",
        **data
    }


# ==================================================
# REPORT 2
# Offer Performance Report
# ==================================================

def get_offer_performance_data(db: Session):

    offers = db.query(Offer).all()

    report = []

    for offer in offers:

        reservations = db.query(
            Reservation
        ).filter(
            Reservation.offer_id == offer.id
        ).all()

        total_reserved = sum(
            reservation.quantity
            for reservation in reservations
            if reservation.status != "cancelled"
        )

        collected_quantity = sum(
            reservation.quantity
            for reservation in reservations
            if reservation.status == "collected"
        )

        total_revenue = sum(
            reservation.total_price
            for reservation in reservations
            if reservation.status == "collected"
        )

        remaining_quantity = (
            offer.quantity - total_reserved
        )

        report.append({
            "offer_id": offer.offer_id,
            "item": offer.item,
            "original_quantity": offer.quantity,
            "reserved_quantity": total_reserved,
            "collected_quantity": collected_quantity,
            "remaining_quantity": remaining_quantity,
            "total_revenue": total_revenue
        })

    return report


@router.get("/offer-performance")
def offer_performance_report(
    db: Session = Depends(get_db)
):

    report = get_offer_performance_data(db)

    return {
        "report": "Offer Performance Report",
        "offers": report
    }


# ==================================================
# REPORT 3
# Customer Reservation / Collection Report
# ==================================================

def get_customer_reservation_data(db: Session):

    reservations = db.query(
        Reservation
    ).all()

    report = []

    for reservation in reservations:

        customer = db.query(
            User
        ).filter(
            User.id == reservation.customer_id
        ).first()

        offer = db.query(
            Offer
        ).filter(
            Offer.id == reservation.offer_id
        ).first()

        report.append({
            "reservation_id": reservation.reservation_id,
            "customer_id": reservation.customer_id,
            "customer_username": (
                customer.username
                if customer
                else None
            ),
            "offer_id": (
                offer.offer_id
                if offer
                else None
            ),
            "item": (
                offer.item
                if offer
                else None
            ),
            "quantity": reservation.quantity,
            "total_price": reservation.total_price,
            "status": reservation.status,
            "reserved_at": reservation.reserved_at
        })

    return report


@router.get("/customer-reservations")
def customer_reservation_report(
    db: Session = Depends(get_db)
):

    report = get_customer_reservation_data(db)

    return {
        "report": "Customer Reservation / Collection Report",
        "total_reservations": len(report),
        "reservations": report
    }


# ==================================================
# CSV REPORT 1
# ==================================================

@router.get("/summary/csv")
def download_summary_csv(
    db: Session = Depends(get_db)
):

    data = get_summary_data(db)

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Report",
        "Total Offers",
        "Total Food Quantity",
        "Total Reservations",
        "Reserved Quantity",
        "Collected Quantity",
        "Cancelled Quantity",
        "Total Sales"
    ])

    writer.writerow([
        "Surplus Sales / Rescue Summary",
        data["total_offers"],
        data["total_food_quantity"],
        data["total_reservations"],
        data["reserved_quantity"],
        data["collected_quantity"],
        data["cancelled_quantity"],
        data["total_sales"]
    ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=surplus_summary.csv"
        }
    )


# ==================================================
# CSV REPORT 2
# ==================================================

@router.get("/offer-performance/csv")
def download_offer_performance_csv(
    db: Session = Depends(get_db)
):

    report = get_offer_performance_data(db)

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Offer ID",
        "Item",
        "Original Quantity",
        "Reserved Quantity",
        "Collected Quantity",
        "Remaining Quantity",
        "Total Revenue"
    ])

    for row in report:

        writer.writerow([
            row["offer_id"],
            row["item"],
            row["original_quantity"],
            row["reserved_quantity"],
            row["collected_quantity"],
            row["remaining_quantity"],
            row["total_revenue"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=offer_performance.csv"
        }
    )


# ==================================================
# CSV REPORT 3
# ==================================================

@router.get("/customer-reservations/csv")
def download_customer_reservation_csv(
    db: Session = Depends(get_db)
):

    report = get_customer_reservation_data(db)

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "Reservation ID",
        "Customer ID",
        "Customer Username",
        "Offer ID",
        "Item",
        "Quantity",
        "Total Price",
        "Status",
        "Reserved At"
    ])

    for row in report:

        writer.writerow([
            row["reservation_id"],
            row["customer_id"],
            row["customer_username"],
            row["offer_id"],
            row["item"],
            row["quantity"],
            row["total_price"],
            row["status"],
            row["reserved_at"]
        ])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=customer_reservations.csv"
        }
    )


# ==================================================
# PDF REPORT 1
# ==================================================

@router.get("/summary/pdf")
def download_summary_pdf(
    db: Session = Depends(get_db)
):

    data = get_summary_data(db)

    output = io.BytesIO()

    pdf = canvas.Canvas(
        output,
        pagesize=letter
    )

    pdf.setTitle(
        "Surplus Sales Rescue Summary"
    )

    pdf.drawString(
        50,
        750,
        "ZeroWasteBite"
    )

    pdf.drawString(
        50,
        730,
        "Surplus Sales / Rescue Summary"
    )

    y = 690

    for key, value in data.items():

        pdf.drawString(
            70,
            y,
            f"{key.replace('_', ' ').title()}: {value}"
        )

        y -= 30

    pdf.save()

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=surplus_summary.pdf"
        }
    )


# ==================================================
# PDF REPORT 2
# ==================================================

@router.get("/offer-performance/pdf")
def download_offer_performance_pdf(
    db: Session = Depends(get_db)
):

    report = get_offer_performance_data(db)

    output = io.BytesIO()

    pdf = canvas.Canvas(
        output,
        pagesize=letter
    )

    pdf.setTitle(
        "Offer Performance Report"
    )

    pdf.drawString(
        50,
        750,
        "ZeroWasteBite - Offer Performance Report"
    )

    y = 710

    for row in report:

        text = (
            f"{row['offer_id']} | "
            f"{row['item']} | "
            f"Qty: {row['original_quantity']} | "
            f"Reserved: {row['reserved_quantity']} | "
            f"Collected: {row['collected_quantity']} | "
            f"Revenue: {row['total_revenue']}"
        )

        pdf.drawString(
            40,
            y,
            text[:110]
        )

        y -= 25

        if y < 50:

            pdf.showPage()

            y = 750

    pdf.save()

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=offer_performance.pdf"
        }
    )


# ==================================================
# PDF REPORT 3
# ==================================================

@router.get("/customer-reservations/pdf")
def download_customer_reservation_pdf(
    db: Session = Depends(get_db)
):

    report = get_customer_reservation_data(db)

    output = io.BytesIO()

    pdf = canvas.Canvas(
        output,
        pagesize=letter
    )

    pdf.setTitle(
        "Customer Reservation Collection Report"
    )

    pdf.drawString(
        50,
        750,
        "ZeroWasteBite"
    )

    pdf.drawString(
        50,
        730,
        "Customer Reservation / Collection Report"
    )

    y = 700

    for row in report:

        text = (
            f"{row['reservation_id']} | "
            f"{row['customer_username']} | "
            f"{row['item']} | "
            f"Qty: {row['quantity']} | "
            f"Status: {row['status']}"
        )

        pdf.drawString(
            40,
            y,
            text[:110]
        )

        y -= 25

        if y < 50:

            pdf.showPage()

            y = 750

    pdf.save()

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=customer_reservations.pdf"
        }
    )