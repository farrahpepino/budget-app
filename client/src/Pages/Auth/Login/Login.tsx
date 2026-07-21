import './Login.css'
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API_URL; 

  return (
    <div className='login'>
        <img src="/savora/1.png" alt="logo" />
        <div className='md'>Simple finance. Grounded life.</div>
        
        <br /><br />

        <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const token = credentialResponse.credential;
              const res = await axios.post(`${apiUrl}/auth/google`, {
                token,
              });            
              localStorage.setItem("user", JSON.stringify(res.data));
              navigate("/", { replace: true });
            } catch (err) {
              console.error("Login failed:", err);
            }
          }}
          onError={() => {
            console.error("Login Failed");
          }}
        />
      </GoogleOAuthProvider>

    </div>
  )
}

export default Login