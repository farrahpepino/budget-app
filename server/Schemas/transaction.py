from sqlalchemy import Column, String, Float, Date, ForeignKey, Boolean
from database import Base
import uuid
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String(36), primary_key=True, index=True, unique=True, default=lambda:str(uuid.uuid4())) 
    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False
    )
    type = Column(String(10), index=True)
    
    acc_1 = Column(String(36), ForeignKey("accounts.id", ondelete="CASCADE"))
    
    acc_1_r = relationship("Account", foreign_keys=[acc_1])
    acc_2 = Column(
        String(36),
        ForeignKey("accounts.id", ondelete="SET NULL"),
        nullable=True
    )    
    
    acc_2_r = relationship("Account", foreign_keys=[acc_2])
    pair_id = Column(String(36), nullable=True)
    category = Column(String(10), nullable=True)
    amount = Column(Float, nullable=False)
    date = Column(Date)    
    note = Column(String(360), nullable=True)
    is_edited = Column(Boolean, default=False)
    is_source = Column(Boolean)
    