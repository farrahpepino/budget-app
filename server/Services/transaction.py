from Repositories.transaction import Transaction_Repository
from DTOs.transaction import Transaction_Dto

class Transaction_Service:
    def __init__(self):
        self.repository = Transaction_Repository()
        
    def create_transaction(self, db, transaction: Transaction_Dto):
        return self.repository.create_transaction(db, transaction)
    
    def get_transactions(self, db, user_id: str, account_type: str, transaction_type: str, page_num: int):
        return self.repository.get_transactions(db, user_id, account_type, transaction_type, page_num)
    
    def delete_transaction(self, db, id: str):
        return self.repository.delete_transaction(db, id)
    
    def get_total_amount_by_account_type(self, db, user_id: str, account_type: str):
        return self.repository.get_total_amount_by_account_type(db, user_id, account_type)
    
    def update_transaction(self, db, id: str, note:str):
        return self.repository.update_transaction(db, id, note)
    
    def get_chart(self, db, user_id: str):
        return self.repository.get_chart(db, user_id)

   