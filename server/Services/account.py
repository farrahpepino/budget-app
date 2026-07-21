from Repositories.account import Account_Repository
from DTOs.account import Account_Dto, Partial_Account_Dto

class Account_Service:
    
    def __init__(self):
        self.repository = Account_Repository()
        
    def create_account (self, db, account: Account_Dto):
        return self.repository.create_account(db, account)
    
    def get_accounts (self, db, account_type: str, user_id: str):
        return self.repository.get_accounts(db, account_type, user_id)
    
    def get_account (self, db, id: str):
        return self.repository.get_account(db, id)
    
    def update_account(self, db, account_dto: Account_Dto ):
        return self.repository.update_account(db, account_dto)
    
    def delete_account(self, db, id: str):
        return self.repository.delete_account(db, id)
    
    
    