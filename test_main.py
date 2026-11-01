from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Тест 1: Проверка, что сервер жив
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Бэкенд работает!"}

# Тест 2: Проверка регистрации с коротким паролем (должна быть ошибка 422)
def test_register_short_password():
    response = client.post(
        "/api/auth/register",
        json={"email": "test_pytest@mail.ru", "password": "123", "name": "Тест"}
    )
    assert response.status_code == 422  # Ожидаем ошибку валидации

# Тест 3: Проверка регистрации с правильными данными (должно быть 200)
def test_register_success():
    # Генерируем случайный email, чтобы не было конфликта, если тест запускается дважды
    import random
    random_email = f"test{random.randint(1, 10000)}@mail.ru"
    
    response = client.post(
        "/api/auth/register",
        json={"email": random_email, "password": "123456", "name": "Тест"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == random_email