"""
Ejecutar UNA vez para poblar la BD:
    python scripts/seed.py
"""
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models.models import Staff, Table, Category, MenuItem
from app.core.security import get_password_hash
import uuid

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Limpiar ──
for model in [MenuItem, Category, Staff, Table]:
    db.query(model).delete()
db.commit()

# ── Staff ──
db.add(Staff(username="admin", hashed_password=get_password_hash("admin123")))

# ── Mesas (10 mesas, cada una con QR único) ──
tables = [Table(number=i, qr_token=str(uuid.uuid4())) for i in range(1, 11)]
db.add_all(tables)

# ── Categorías y productos ──
data = [
    {
        "name": "Café", "emoji": "☕", "sort_order": 1,
        "items": [
            {"name": "Espresso", "price": 3800, "price_large": 4600},
            {"name": "Americano", "price": 4600},
            {"name": "Cortado", "price": 4500},
            {"name": "Cappuccino", "price": 4900, "price_large": 5800},
            {"name": "Flat White", "price": 5500},
            {"name": "Latte", "price": 5300},
            {"name": "Moccacino", "price": 6900},
            {"name": "Chocolate", "price": 5200},
            {"name": "Batch Brew – filtrado del día", "price": 5300},
            {"name": "Filtrados – método manual", "price": 7700},
            {"name": "Iced Americano", "price": 5000},
            {"name": "Iced Flat White", "price": 5700},
            {"name": "Iced Latte", "price": 5500},
        ]
    },
    {
        "name": "Especiales Fríos", "emoji": "❄", "sort_order": 2,
        "items": [
            {"name": "Iced Latte Nocciola", "price": 7300, "description": "Con avellanas tostadas y syrup casero."},
            {"name": "Enamorate", "price": 7300, "description": "Iced latte con almíbar de mora e hibiscus."},
            {"name": "Iced Cococcino", "price": 7300, "description": "Cappu con dulce de coco especiado y sal marina."},
            {"name": "Cold Brew Session", "price": 6600, "description": "Consultá por el especial del mes."},
            {"name": "Espresso Tonic Punto", "price": 7500, "description": "Café, tónica, bitter angostura y jugo de naranja."},
        ]
    },
    {
        "name": "Otras Bebidas", "emoji": "🥤", "sort_order": 3,
        "items": [
            {"name": "Limonada, Menta y Jengibre", "price": 4600},
            {"name": "Jugo de Naranja", "price": 4900},
            {"name": "Vermú Lombroni", "price": 7500},
            {"name": "Kombucha Bunji", "price": 6500},
            {"name": "Agua Mineral", "price": 3800},
        ]
    },
    {
        "name": "Té", "emoji": "🍵", "sort_order": 4,
        "items": [
            {"name": "Chai / Negro – Cura Té Alma", "price": 4200},
            {"name": "Chai Latte", "price": 5200},
            {"name": "Iced Chai", "price": 4400},
        ]
    },
    {
        "name": "Promo Desayuno", "emoji": "🥐", "sort_order": 5,
        "items": [
            {"name": "Café + Superluna", "price": 7500},
            {"name": "Café + Chipá", "price": 7900},
            {"name": "Café + Tostadas", "price": 8500},
            {"name": "Café + Tostado", "price": 10400},
        ]
    },
    {
        "name": "Promo Almuerzo", "emoji": "🥗", "sort_order": 6,
        "items": [
            {"name": "Ensalada + Bebida", "price": 15200},
            {"name": "Wrap + Papas + Bebida", "price": 15700},
            {"name": "Sandwich + Papas + Bebida", "price": 16100},
            {"name": "Tarta + Ensaladita + Bebida", "price": 17100},
        ]
    },
    {
        "name": "Todo el Día", "emoji": "🍽", "sort_order": 7,
        "items": [
            {"name": "Medialuna Rellena", "price": 7300, "description": "Jamón y queso / capresse"},
            {"name": "Chipá Sandwich", "price": 6800, "description": "Jamón y queso / capresse"},
            {"name": "Tostado", "price": 8500, "description": "En pan hecho por nosotros: JyQ o capresse"},
            {"name": "Tostadas de Pan de Molde", "price": 6500, "description": "Queso crema y mermelada de frutos rojos"},
            {"name": "Yogurt Bowl", "price": 8800, "description": "Granola crocante, miel orgánica y fruta fresca"},
            {"name": "Bowl Proteico", "price": 14400, "description": "Huevo mollet, palta, queso crema cítrico, queso madurado, trucha ahumada, pan de campo casero"},
        ]
    },
    {
        "name": "Tostones", "emoji": "🍞", "sort_order": 8,
        "items": [
            {"name": "Avocado Toast", "price": 10100, "description": "Huevo mollet, crema cítrica, cherry y aceto reduc."},
            {"name": "Trucha Toast", "price": 12500, "description": "Cremoso blendo, cebolla encurtida, ralladura limón."},
        ]
    },
    {
        "name": "Wraps", "emoji": "🌯", "sort_order": 9,
        "items": [
            {"name": "Wrap Bondiola", "price": 12600, "description": "Cebolla caramelizada, morrón asado y queso. Con papas."},
            {"name": "Wrap Mushroom", "price": 12600, "description": "Con papas."},
        ]
    },
    {
        "name": "Sandwiches", "emoji": "🥪", "sort_order": 10,
        "items": [
            {"name": "Pastrami & Focaccia", "price": 13000, "description": "Fiambre de pastrón con pickles de pepino, mostaza honey y tybo fundido + papas."},
            {"name": "Curry de Pollo", "price": 13000, "description": "Pechuga con crema curry, hojas verdes, tomate fresco y queso fundido + papas."},
            {"name": "Tuna Brioche", "price": 13000, "description": "Atún en mayo suave, palta, tomate, col encurtido en pan brioche + ensaladita."},
        ]
    },
    {
        "name": "Ensaladas", "emoji": "🥗", "sort_order": 11,
        "items": [
            {"name": "Ensalada Punto", "price": 12100, "description": "Cabutia asada, queso azul, peras, castañas de cajú, verdes frescos y semillas."},
            {"name": "Caesar", "price": 12100, "description": "Pechuga, queso goya en hebras, crutones crocantes, aderezo casero en mix de hojas."},
            {"name": "Trucha Salad", "price": 14100, "description": "Trucha ahumada, arroz yamani, huevo mollet, palta, col morado y sésamo negro."},
        ]
    },
    {
        "name": "Tarta de la Semana", "emoji": "🥧", "sort_order": 12,
        "items": [
            {"name": "Tarta de la Semana", "price": 14000, "description": "Quiche con ensaladita y vinagreta."},
        ]
    },
    {
        "name": "Pastelería de Mostrador", "emoji": "🧁", "sort_order": 13,
        "items": [
            {"name": "Medialuna (super)", "price": 3400},
            {"name": "Croissant", "price": 4200},
            {"name": "Danesa con Fruta", "price": 5400},
            {"name": "Pan de Chocolate", "price": 5600},
            {"name": "Fosforito JyQ", "price": 6100},
            {"name": "Roll de Canela Brioche", "price": 5800},
            {"name": "Scon Parmesano", "price": 6100},
            {"name": "Chipá", "price": 4100, "tag": "sin tacc"},
            {"name": "Alfajor de Coco y DDL", "price": 5000, "tag": "sin tacc"},
            {"name": "Alfajor de Limón Tita", "price": 4600, "tag": "sin tacc"},
            {"name": "Alfajor de Almendra", "price": 5200},
            {"name": "Cookie de Naranja y Pistacho", "price": 4400, "tag": "vegano"},
            {"name": "Cookie de Chocolate y Sal Marina", "price": 4400, "tag": "vegano"},
            {"name": "Cookie Avellanas, Maní y Choco", "price": 4400, "tag": "vegano"},
            {"name": "Budín Banana, Choco y Avellanas", "price": 5800, "tag": "vegano"},
            {"name": "Budín Limón y Arándanos", "price": 6000},
            {"name": "Mini Tiramisú", "price": 7200, "tag": "sin tacc"},
            {"name": "Mini Lemon Pie", "price": 7000},
            {"name": "Torta Vasca", "price": 8500, "tag": "sin tacc"},
        ]
    },
]

for cat_data in data:
    category = Category(
        name=cat_data["name"],
        emoji=cat_data.get("emoji"),
        sort_order=cat_data["sort_order"]
    )
    db.add(category)
    db.flush()
    for idx, item in enumerate(cat_data["items"]):
        db.add(MenuItem(
            category_id=category.id,
            name=item["name"],
            price=item["price"],
            price_large=item.get("price_large"),
            description=item.get("description"),
            tag=item.get("tag"),
            sort_order=idx,
        ))

db.commit()
db.close()
print("✅ Seed completado: staff, 10 mesas y menú completo cargados.")