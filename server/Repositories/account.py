from sqlalchemy.orm import Session
from Schemas.account import Account

from DTOs.account import Account_Dto, Partial_Account_Dto

class Account_Repository:
    def create_account(self, db:Session, account_dto: Account_Dto):
        account = Account(**account_dto.model_dump())
    
        db.add(account)
        db.commit()
        db.refresh(account)
        return account
    
    def get_accounts(self, db:Session, account_type: str, user_id: str):
        return db.query(Account)\
                .filter(Account.user_id == user_id)\
                .filter(Account.type == account_type)\
                .all()
                
    def get_account(self, db:Session, id: str):
        return db.query(Account)\
                .filter(Account.id == id)\
                .first()
                
    def update_balance(self, db:Session, balance:float, id: str):
        account = self.get_account(db, id)
        
        if not account:
            return None  
        
        account.balance = balance
        
        db.commit()
        db.refresh(account)
        
        return account.balance
    
    def delete_account(self, db:Session, id: str):
        account = self.get_account(db,id)
        
        if not account:
            return None
        
        db.delete(account)
        db.commit()
        
        return True 
    
    def update_account(self, db: Session, account_dto: Partial_Account_Dto):
        account = self.get_account(db, account_dto.id)

        if not account:
            return None

        if account_dto.bank is not None:
            account.bank = account_dto.bank

        account.date = account_dto.date

        db.commit()
        db.refresh(account)
        return account
    
    
        
        
    
    