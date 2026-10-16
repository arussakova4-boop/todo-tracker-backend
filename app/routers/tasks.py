from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# 1. СОЗДАТЬ ЗАДАЧУ
@router.post("/", response_model=schemas.TaskResponse)
def create_task(
    task_data: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    new_task = models.Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        estimated_time=task_data.estimated_time,
        owner_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# 2. ПОЛУЧИТЬ ВСЕ СВОИ ЗАДАЧИ
@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    return tasks

# 3. ОБНОВИТЬ ЗАДАЧУ (например, отметить выполненной)
@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    task_query = db.query(models.Task).filter(models.Task.id == task_id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Это не ваша задача")
    
    update_data = task_data.model_dump(exclude_unset=True)
    task_query.update(update_data, synchronize_session=False)
    db.commit()
    db.refresh(task)
    return task

# 4. УДАЛИТЬ ЗАДАЧУ
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    task_query = db.query(models.Task).filter(models.Task.id == task_id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Это не ваша задача")
    
    task_query.delete(synchronize_session=False)
    db.commit()
    return None