from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Table
from app.schemas.schemas import TableOut
from typing import List

router = APIRouter(prefix="/tables", tags=["Tables"])

@router.get("/", response_model=List[TableOut])
def list_tables(db: Session = Depends(get_db)):
    return db.query(Table).filter(Table.is_active == True).all()

@router.get("/by-token/{qr_token}", response_model=TableOut)
def get_table_by_token(qr_token: str, db: Session = Depends(get_db)):
    """El QR apunta a /mesa/{qr_token} — el front obtiene el table_id desde acá"""
    table = db.query(Table).filter(Table.qr_token == qr_token).first()
    if not table:
        raise HTTPException(status_code=404, detail="Mesa no encontrada")
    return table