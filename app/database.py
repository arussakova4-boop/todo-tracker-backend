from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Создаем файл базы данных SQLite в корне проекта
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"

# Движок — это то, что соединяется с базой
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Фабрика сессий — каждый запрос будет создавать сессию
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс для моделей
Base = declarative_base()

# Функция для получения сессии (будем использовать в эндпоинтах)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()