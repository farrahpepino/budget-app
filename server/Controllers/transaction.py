from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import Body


from database import get_db
from Services.transaction import Transaction_Service
from DTOs.transaction import Transaction_Dto

router = APIRouter()
service = Transaction_Service()

@router.post("/transactions", response_model=Transaction_Dto)
def create_transaction(body: Transaction_Dto, db: Session = Depends(get_db)):
    transaction = service.create_transaction(db, body)
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction could not be created"
        ) 
        
    return transaction

@router.get("/transactions")
def get_transactions(
    user_id: str,
    account_type: str,
    page_num: int = 1,
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    page_num = int(page_num) 
    transactions = service.get_transactions(db, user_id, account_type, transaction_type,  page_num)
    if transactions is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transactions not found"
        )
        
    return transactions

@router.delete("/transaction/{id}")
def delete_transaction(id: str, db: Session = Depends(get_db)):
    deleted = service.delete_transaction(db, id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction could not be deleted"
        )
        
    return deleted


@router.get("/transactions/total-balance/{user_id}/{account_type}")
def get_total_amount_by_account_type(
    user_id: str,
    account_type: str,
    db: Session = Depends(get_db)
):
    return service.get_total_amount_by_account_type(db, user_id, account_type)

@router.patch("/transaction/{id}", response_model=str)
def update_transaction(id: str, note: str = Body(...), db: Session = Depends(get_db)):
    return service.update_transaction(db, id, note)


@router.get("/transactions/{user_id}/chart")
def get_chart( user_id: str, db:Session = Depends(get_db)):
    return service.get_chart(db, user_id)
