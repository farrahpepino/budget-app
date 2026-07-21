from Repositories.user import User_Repository

class User_Service:
    
    def __init__(self):
        self.repository = User_Repository()
        
    def update_name(self, db, id: str, name: str):
        return self.repository.update_name(db, id, name)
    
    def delete_user(self, db, id: str):
        return self.repository.delete_user(db, id)
    