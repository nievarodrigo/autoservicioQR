from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class OrderStatus(str, enum.Enum):
    pending = "pending"       # recién llegó
    confirmed = "confirmed"   # el mostrador lo vio
    preparing = "preparing"   # en cocina
    ready = "ready"           # listo para llevar a la mesa
    delivered = "delivered"   # entregado
    cancelled = "cancelled"

class PaymentMethod(str, enum.Enum):
    cash = "cash"
    digital = "digital"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Table(Base):
    __tablename__ = "tables"
    id = Column(Integer, primary_key=True)
    number = Column(Integer, unique=True, nullable=False)
    qr_token = Column(String(100), unique=True, nullable=False)  # UUID estático por mesa
    is_active = Column(Boolean, default=True)
    orders = relationship("Order", back_populates="table")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    emoji = Column(String(10))
    sort_order = Column(Integer, default=0)
    items = relationship("MenuItem", back_populates="category")

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    price_large = Column(Float, nullable=True)  # Para items con dos tamaños (ej: espresso)
    tag = Column(String(50), nullable=True)      # "sin tacc", "v" (vegano), etc.
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    category = relationship("Category", back_populates="items")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    table = relationship("Table", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

    @property
    def total(self):
        return sum(item.subtotal for item in self.items)

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)  # precio al momento del pedido
    notes = Column(String(255), nullable=True)
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem")

    @property
    def subtotal(self):
        return self.unit_price * self.quantity