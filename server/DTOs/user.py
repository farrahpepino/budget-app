from pydantic import BaseModel
from typing import Optional

class User_Dto(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
