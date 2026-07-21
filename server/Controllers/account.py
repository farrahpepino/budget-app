from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from Services.account import Account_Service
from DTOs.account import Account_Dto, Partial_Account_Dto

router = APIRouter()
service = Account_Service()

@router.post("/accounts", response_model=Account_Dto)
def create_account(body: Account_Dto, db: Session = Depends(get_db)):
    account = service.create_account(db, body)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account could not be created"
        )

    return account

@router.get("/accounts/{user_id}/{account_type}", response_model=List[Account_Dto])
def get_accounts(
    user_id: str,
    account_type: str,
    db: Session = Depends(get_db)
):
    accounts = service.get_accounts(db, account_type, user_id)

    if accounts is None:
        return []

    return accounts

@router.get("/accounts/{id}", response_model=Account_Dto)
def get_account(
    id: str,
    db: Session = Depends(get_db)
):
    account = service.get_account(db, id)

    if not account:
        return 

    return account

@router.patch("/accounts/{id}/{balance}")
def update_balance(id: str, balance: float, db: Session = Depends(get_db)):
    return service.update_balance(db, balance, id)

@router.patch("/accounts")
def update_account(account_dto: Partial_Account_Dto, db: Session = Depends(get_db)):
    return service.update_account(db, account_dto)

@router.delete("/accounts/{id}")
def delete_account(id, db: Session = Depends(get_db)):
    deleted = service.delete_account(db, id)
    
    print(id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account could not be deleted"
        )
        
    return deleted