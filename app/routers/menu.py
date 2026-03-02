from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.models import Category, MenuItem
from app.schemas.schemas import CategoryOut
from typing import List

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/", response_model=List[CategoryOut])
def get_full_menu(db: Session = Depends(get_db)):
    """Endpoint público — lo llama el QR de la mesa"""
    categories = (
        db.query(Category)
        .options(joinedload(Category.items))
        .order_by(Category.sort_order)
        .all()
    )
    # Solo items disponibles
    for cat in categories:
        cat.items = [i for i in cat.items if i.is_available]
    return categories

@router.patch("/items/{item_id}/availability", tags=["Staff"])
def toggle_availability(item_id: int, is_available: bool, db: Session = Depends(get_db)):
    """El mostrador puede marcar un item como agotado"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    item.is_available = is_available
    db.commit()
    return {"ok": True, "item_id": item_id, "is_available": is_available}