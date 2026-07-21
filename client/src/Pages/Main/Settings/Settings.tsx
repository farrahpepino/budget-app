import Logo from "../../Shared/Logo/Logo";
import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar";
import './Settings.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";

const Settings = () => {

    const apiUrl = import.meta.env.VITE_API_URL; 
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [email, setEmail] = useState("");
    
    const navigate = useNavigate();

    const deleteAccount = async (email: string) => {

        if (email !== user.email) {
            alert("Email does not match your account.");
            return;
        }

        try {
            await axios.delete(`${apiUrl}/user/${user.id}`);

            localStorage.removeItem("user");

            navigate("/login");

        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account.");
        }
    }

    return (
        <div>
            <Logo />
            <Sidebar />
    
            <div className='settings-container'>
                <div className='settings-box border settings'>
                    <div className="bold lg">Settings</div>
                    <br /><br /><br />

                    <div>
                        <div className="span">
                            <div className="bold ml-2 lg">Name</div>
                            <div className="sub">{user.name}</div>
                        </div>
                        <br /><br />
                        <div className="span">
                            <div className="bold ml-2 lg">Email</div>
                            <div className="sub">{user.email}</div>
                        </div>
                    </div>
                </div>
                <div className='settings-box border delete'>
                    <div className="bold lg">Delete Account</div>
                    <br />
                    <div>
                        <div className="ml-2">To delete account, type your email.</div>
                        <br />
                        <form 
                            className="span ml-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                deleteAccount(email);
                            }}
                        >
                            <input 
                                type="email" 
                                title="Email" 
                                name="email" 
                                id="email" 
                                className="border input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button className="btn red-btn">
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      )
}

export default Settings