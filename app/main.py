from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import auth, tasks
from fastapi import Request
from fastapi.responses import JSONResponse

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="To-Do Task Tracker API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем запросы с любого адреса
    allow_credentials=False,  # ВАЖНО: False, чтобы не было конфликта с JWT
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Разрешаем все заголовки (включая Authorization)
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера. Попробуйте позже."},
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Бэкенд работает!"}