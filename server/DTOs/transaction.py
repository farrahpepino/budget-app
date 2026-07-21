from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Transaction_Dto(BaseModel):
    id: Optional[str] = None
    user_id: str
    type: str
    acc_1: str
    acc_2: Optional[str] = None
    category: Optional[str] = None
    amount: float
    date: datetime
    note: Optional[str] = None
    is_edited: bool = True
    pair_id: Optional[str] = None
    is_source: bool 


    