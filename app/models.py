from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# Таблица пользователей
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связь: у одного пользователя много задач
    tasks = relationship("Task", back_populates="owner")


# Таблица задач
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)          # Название задачи
    description = Column(String, nullable=True)     # Описание
    is_done = Column(Boolean, default=False)        # Выполнена?
    priority = Column(Integer, default=1)           # Приоритет (1-3)
    estimated_time = Column(Integer, nullable=True) # Оценка времени в минутах
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Внешний ключ на пользователя
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")