from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from datetime import datetime


class Account_Dto(BaseModel):
    id: Optional[str] = None
    user_id: str
    type: str 
    bank: str 
    date: Optional[datetime] = None
    last_digits: int
    is_edited: bool = True
class Partial_Account_Dto(BaseModel):
    id: str
    bank: Optional[str] = None 
    date: datetime = datetime.now()
    is_edited: bool = True
