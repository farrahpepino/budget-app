from sqlalchemy import Column, String
from database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, index=True, unique=True, default=lambda:str(uuid.uuid4())) 
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)