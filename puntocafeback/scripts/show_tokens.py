import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.models import Table

db = SessionLocal()
tables = db.query(Table).order_by(Table.number).all()

print("\n=== TOKENS DE MESA ===\n")
for t in tables:
    print(f"Mesa {t.number}: http://localhost:5173/?token={t.qr_token}")
print()