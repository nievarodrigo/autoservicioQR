# 🏴 AutoservicioQR — Sistema de pedidos por QR para cafeterías

Sistema fullstack que reemplaza el modelo de autoservicio tradicional en una cafetería real. El cliente escanea el QR de su mesa, navega el menú, arma su pedido y lo confirma desde el celular. El mostrador recibe los pedidos en tiempo real y gestiona los estados hasta la entrega.

---

## 🧩 El problema

La cafetería operaba en modalidad autoservicio: el cliente tenía que ir al mostrador a pedir. Quienes no conocían el lugar esperaban sentados, se cansaban y se iban — generando reseñas negativas en Google y pérdida de ventas.

## 💡 La solución

Cada mesa tiene un QR único. Al escanearlo, el cliente accede a un menú digital desde su celular, hace su pedido y elige cómo pagar. El mostrador ve los pedidos entrantes en tiempo real y los lleva a la mesa.

---

## 🗂 Estructura del repositorio

```
AutoservicioQR/
├── puntocafeback/        # Backend — FastAPI + MySQL
└── front-end/            # Frontend cliente — React (Vite)
```

> El frontend del mostrador está en desarrollo.

---

## ⚙️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Python, FastAPI, SQLAlchemy, Pydantic |
| Base de datos | MySQL |
| Autenticación | JWT (Passlib + Python-Jose) |
| Tiempo real | WebSockets (FastAPI nativo) |
| Frontend cliente | React (Vite) |
| Control de versiones | Git + GitHub (monorepo) |

---

## 🚀 Cómo correr el proyecto

### Backend

```bash
cd puntocafeback

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editá .env con tus credenciales de MySQL

# Crear la base de datos
mysql -u root -p -e "CREATE DATABASE cafeteria_db CHARACTER SET utf8mb4;"

# Cargar el menú completo
python scripts/seed.py

# Levantar el servidor
uvicorn main:app --reload
```

API disponible en `http://localhost:8000`
Documentación interactiva en `http://localhost:8000/docs`

### Frontend cliente

```bash
cd front-end
npm install
npm run dev
```

Abrí `http://localhost:5173/?token=TU_QR_TOKEN`

Para obtener un token de mesa:
```sql
USE cafeteria_db;
SELECT number, qr_token FROM tables;
```

---

## 📡 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/menu/` | Menú completo por categorías |
| `GET` | `/tables/by-token/{token}` | Obtener mesa por QR |
| `POST` | `/orders/?table_token=X` | Crear pedido |
| `GET` | `/orders/` | Listar pedidos (mostrador) |
| `PATCH` | `/orders/{id}/status` | Cambiar estado del pedido |
| `PATCH` | `/orders/{id}/payment` | Marcar pago como cobrado |
| `PATCH` | `/menu/items/{id}/availability` | Marcar item como agotado |
| `POST` | `/auth/login` | Login del personal |
| `WS` | `/ws/mostrador` | Pedidos en tiempo real |

---

## 🗺 Roadmap

- [x] Backend REST completo
- [x] Seed con menú real (13 categorías, 70+ items)
- [x] Frontend cliente (menú + carrito + confirmación)
- [ ] Panel del mostrador en tiempo real
- [ ] Panel administrador con KPIs y gráficas
- [ ] Ticket imprimible por pedido
- [ ] Deploy en cloud (Railway / Render + Vercel)

---

## 👤 Autor

**Rodrigo Nieva** — [@rodrosn0w](https://github.com/rodrosn0w)
