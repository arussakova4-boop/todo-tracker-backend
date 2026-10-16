from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import auth, tasks  # <-- добавили tasks

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="To-Do Task Tracker API")

app.include_router(auth.router)
app.include_router(tasks.router)  # <-- добавили подключение

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Бэкенд работает!"}