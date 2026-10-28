from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- Добавили импорт
from .database import engine, Base
from . import models
from .routers import auth, tasks

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="To-Do Task Tracker API")

# <-- Добавили настройку CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы с любого адреса (для разработки ок)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Разрешаем все заголовки (включая Authorization)
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Бэкенд работает!"}