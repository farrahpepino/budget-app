from sqlalchemy.orm import Session
from Schemas.user import User

class User_Repository:
    def create_user(self, db:Session, id: str, email: str, name: str):
        user = User(
            id = id,
            email = email,
            name = name
        )
                
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    def get_user(self, db:Session, id: str):
        return db.query(User).filter(User.id == id).first()
    
    def update_name(self, db: Session, id: str, name: str):
        user = self.get_user(db, id)
        
        if not user:
            return None  
        
        user.name = name
        
        db.commit()
        db.refresh(user)
        
        return user.name
    
    def delete_user(self, db: Session, id: str):
        user = self.get_user(db, id)
        
        if not user:
            return None  
        
        db.delete(user)
        db.commit()
        
        return True
