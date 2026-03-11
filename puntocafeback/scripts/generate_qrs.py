import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import qrcode
from app.database import SessionLocal
from app.models.models import Table

FRONTEND_URL = "http://192.168.0.23:5173"  # cambiá por tu IP o dominio
OUTPUT_DIR = "qrs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

db = SessionLocal()
tables = db.query(Table).filter(Table.is_active == True).all()

for table in tables:
    url = f"{FRONTEND_URL}/?token={table.qr_token}"
    img = qrcode.make(url)
    path = f"{OUTPUT_DIR}/mesa_{table.number}.png"
    img.save(path)
    print(f"✅ Mesa {table.number} → {path}")

print(f"\n{len(tables)} QRs generados en la carpeta /{OUTPUT_DIR}")