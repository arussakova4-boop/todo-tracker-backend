from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import auth  # <-- Новая строка

# Создаем таблицы в базе данных при запуске
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="To-Do Task Tracker API")

app.include_router(auth.router)  # <-- Новая строка

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Бэкенд работает!"}