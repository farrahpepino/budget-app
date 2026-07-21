from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from Services.user import User_Service
from DTOs.token import Token_Request
from DTOs.user import User_Dto

router = APIRouter()
service = User_Service()

@router.patch("/user/{id}/{name}")
def update_name(id: str, name: str, db: Session = Depends(get_db)):
    return service.update_name(db, id, name)

@router.delete("/user/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    return service.delete_user(db, id)

