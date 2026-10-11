from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Схема для регистрации (что присылает пользователь)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

# Схема для входа (что присылает пользователь)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Схема для ответа (что сервер отдает пользователю)
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # Позволяет читать данные из ORM-моделей