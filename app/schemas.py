from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# Схема для входа (что присылает пользователь)
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)  # <-- пароль минимум 6 символов
    name: Optional[str] = None

# Схема для ответа (что сервер отдает пользователю)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # Позволяет читать данные из ORM-моделей

# --- Схемы для задач ---

class TaskCreate(BaseModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None
    priority: Optional[int] = 1
    estimated_time: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_done: Optional[bool] = None
    priority: Optional[int] = None
    estimated_time: Optional[int] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_done: bool
    priority: int
    estimated_time: Optional[int] = None
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True