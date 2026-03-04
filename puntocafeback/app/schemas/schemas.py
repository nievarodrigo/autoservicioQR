from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.models import OrderStatus, PaymentMethod, PaymentStatus

# ── AUTH ──────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# ── MENU ──────────────────────────────────────────────
class MenuItemOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    price_large: Optional[float]
    tag: Optional[str]
    is_available: bool
    image_url: Optional[str]

    class Config:
        from_attributes = True

class CategoryOut(BaseModel):
    id: int
    name: str
    emoji: Optional[str]
    items: List[MenuItemOut]

    class Config:
        from_attributes = True

# ── ORDERS ────────────────────────────────────────────
class OrderItemIn(BaseModel):
    menu_item_id: int
    quantity: int = 1
    notes: Optional[str] = None

class OrderCreate(BaseModel):
    payment_method: PaymentMethod
    notes: Optional[str] = None
    items: List[OrderItemIn]

class OrderItemOut(BaseModel):
    id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float
    notes: Optional[str]

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    table_id: int
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    notes: Optional[str]
    total: float
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderPaymentUpdate(BaseModel):
    payment_status: PaymentStatus

# ── TABLES ────────────────────────────────────────────
class TableOut(BaseModel):
    id: int
    number: int
    qr_token: str

    class Config:
        from_attributes = True