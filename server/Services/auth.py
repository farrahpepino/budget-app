from google.oauth2 import id_token
from google.auth.transport import requests
import os

from Repositories.user import User_Repository
from Exceptions.auth import InvalidTokenError

class Auth_Service:
    
    def __init__(self):
        self.repository = User_Repository()
        
    def authenticate_account(self, db, token: str):
        try: 
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                os.getenv("google_client_id")
            )
            
        except ValueError:
            raise InvalidTokenError()
        
        id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name", "")
        
        user = self.repository.get_user(db, id)
        
        if not user:
            user = self.repository.create_user(db, id, email, name)
            
        return user