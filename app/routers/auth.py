from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .. import models, schemas
from ..database import get_db
from .. import oauth2

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Настройка шифрования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

@router.post("/register", response_model=schemas.UserResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Проверяем, есть ли уже пользователь с таким email
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    # 2. Шифруем пароль
    hashed_password = get_password_hash(user_data.password)
    
    # 3. Создаем нового пользователя
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name
    )
    
    # 4. Сохраняем в базу данных
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 5. Возвращаем данные пользователя (без пароля!)
    return new_user

@router.post("/login")
def login(user_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Ищем пользователя по email (в форме OAuth2 это поле называется username)
    user = db.query(models.User).filter(models.User.email == user_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    # 2. Проверяем пароль
    if not pwd_context.verify(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    
    # 3. Создаем JWT-токен
    access_token = oauth2.create_access_token(data={"sub": user.email})
    
    # 4. Возвращаем токен
    return {"access_token": access_token, "token_type": "bearer"}