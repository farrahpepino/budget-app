from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float, Boolean
from datetime import datetime
from database import Base
import uuid


class Account(Base):
    __tablename__ = "accounts"
    
    id = Column(String(36), primary_key=True, index=True, default=lambda:str(uuid.uuid4())) 
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    type = Column(String(10), index=True)
    bank = Column(String(255), index=True)
    date = Column(DateTime, default=datetime.now)
    last_digits = Column(Integer)
    is_edited = Column(Boolean, default=False)
    
    
    