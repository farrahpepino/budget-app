import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar";
import Logo from "../../Shared/Logo/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AccountEdit = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { account } = location.state;

    const apiUrl = import.meta.env.VITE_API_URL;

    const [type] = useState(account.type || "");
    const [bank, setBank] = useState(account.bank || "");

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            navigate("/accounts");

        } catch (error) {
            console.error(error);
        }
    };

    const clear = () => {
        setBank("");
    };

    return (
        <div>
            <Logo />
            <Sidebar />

            <div className='container'>
                <div className='box border'>

                    <div className="span">

                        <svg
                            onClick={() => navigate("/accounts")}
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                        >
                            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                        </svg>

                        <div className="bold lg">
                            Edit Account
                        </div>

                    </div>

                    <br /><br /><br />

                    <form onSubmit={save}>

                        <div>

                            <strong>Type</strong>

                            <br />
                            <br />

                            <div className="span ml-6">

                                <div
                                    className="span mr-2 disabled sub"
                                >
                                    <div
                                        className={`option-btn ${type === "Checking" ? "selected" : ""}`}
                                    ></div>

                                    <span>Checking</span>
                                </div>

                                <div
                                    className="span mr-2 disabled sub"
                                > 
                                    <div
                                        className={`option-btn ${type === "Credit" ? "selected" : ""}`}
                                    ></div>

                                    <span>Credit</span>
                                </div>

                                <div
                                    className="span mr-2 disabled sub"
                                >
                                    <div
                                        className={`option-btn ${type === "Savings" ? "selected" : ""}`}
                                    ></div>

                                    <span>Savings</span>
                                </div>

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Bank</strong>

                                <br />
                                <br />

                                <input
                                    type="text"
                                    title="bank"
                                    name="bank"
                                    id="bank"
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                    className="border ml-6 mt input"
                                />

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Balance</strong>

                                <br />

                                <div className="ml-6 mt sub">
                                    {Number(account.balance).toFixed(2)} USD
                                </div>

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Date</strong>

                                <br />

                                <div className="sub ml-6 mt span">
                                    {new Date(account.date).toLocaleDateString('en-US')}
                                    {
                                        !account.is_edited &&
                                        <span className="sub italic">Edited</span>
                                    }
                                </div>

                            </div>

                            <br />
                            <br />

                            <div className="span">

                                <strong>Last 4 digits</strong>

                                <div className="sub">
                                    {account.last_digits}
                                </div>

                            </div>

                        </div>

                        <br /><br /><br />

                        <div className="span set-buttons">

                            <button
                                type="button"
                                onClick={clear}
                                className="red-btn btn"
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="green-btn btn"
                            >
                                Save
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default AccountEdit;