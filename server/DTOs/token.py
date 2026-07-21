from pydantic import BaseModel

class Token_Request(BaseModel):
    token: str

