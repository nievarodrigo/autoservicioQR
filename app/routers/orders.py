from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.models import Order, OrderItem, MenuItem, Table, OrderStatus
from app.schemas.schemas import OrderCreate, OrderOut, OrderStatusUpdate, OrderPaymentUpdate
from typing import List

router = APIRouter(prefix="/orders", tags=["Orders"])

# ── CLIENTE (desde la mesa, anónimo) ──────────────────

@router.post("/", response_model=OrderOut, status_code=201)
def create_order(table_token: str, data: OrderCreate, db: Session = Depends(get_db)):
    """El cliente crea su pedido escaneando el QR (table_token como query param)"""
    table = db.query(Table).filter(Table.qr_token == table_token).first()
    if not table:
        raise HTTPException(status_code=404, detail="Mesa inválida")

    if not data.items:
        raise HTTPException(status_code=400, detail="El pedido no tiene items")

    order = Order(
        table_id=table.id,
        payment_method=data.payment_method,
        notes=data.notes,
    )
    db.add(order)
    db.flush()

    for item_in in data.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_in.menu_item_id,
            MenuItem.is_available == True
        ).first()
        if not menu_item:
            raise HTTPException(status_code=400, detail=f"Item {item_in.menu_item_id} no disponible")
        db.add(OrderItem(
            order_id=order.id,
            menu_item_id=menu_item.id,
            quantity=item_in.quantity,
            unit_price=menu_item.price,
            notes=item_in.notes,
        ))

    db.commit()
    db.refresh(order)
    return _load_order(order.id, db)


# ── MOSTRADOR (staff) ─────────────────────────────────

@router.get("/", response_model=List[OrderOut])
def list_orders(status: OrderStatus = None, db: Session = Depends(get_db)):
    """Lista pedidos. Filtrar por status opcional: ?status=pending"""
    q = db.query(Order).options(joinedload(Order.items))
    if status:
        q = q.filter(Order.status == status)
    return [_build_out(o) for o in q.order_by(Order.created_at.desc()).all()]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return _load_order(order_id, db)


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    order.status = data.status
    db.commit()
    return _load_order(order_id, db)


@router.patch("/{order_id}/payment", response_model=OrderOut)
def update_payment_status(order_id: int, data: OrderPaymentUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    order.payment_status = data.payment_status
    db.commit()
    return _load_order(order_id, db)


# ── Helpers ───────────────────────────────────────────

def _load_order(order_id: int, db: Session) -> OrderOut:
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return _build_out(order)


def _build_out(order: Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        table_id=order.table_id,
        status=order.status,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        notes=order.notes,
        total=order.total,
        created_at=order.created_at,
        updated_at=order.updated_at,
        items=[
            {
                "id": i.id,
                "menu_item_id": i.menu_item_id,
                "quantity": i.quantity,
                "unit_price": i.unit_price,
                "subtotal": i.subtotal,
                "notes": i.notes,
            }
            for i in order.items
        ],
    )