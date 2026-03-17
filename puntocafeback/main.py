from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, menu, orders, tables
from app.routers.ws import router as ws_router, manager

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafetería API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(tables.router)
app.include_router(ws_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Cafetería API corriendo 🍵"}