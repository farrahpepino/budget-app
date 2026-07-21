import { useState } from "react";
import Logo from "../../Shared/Logo/Logo";
import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";



const Account = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: "",
        user_id: user?.id,
        bank: "",
        balance: 0,
        date: new Date().toISOString(),
        last_digits: ""
    });
    
    const pairId = String(uuidv4());
    const isFormValid =
    formData.type.trim() !== "" &&
    formData.bank.trim() !== "" &&
    formData.balance > 0 &&
    formData.date.trim() !== "" &&
    /^\d{4}$/.test(formData.last_digits);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "balance"
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleType = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            type
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${apiUrl}/accounts`,
                {
                    type: formData.type,
                    user_id: user?.id,
                    bank: formData.bank,
                    date: formData.date,
                    last_digits: formData.last_digits
                }
            );

            await axios.post(`${apiUrl}/transactions`, {
                user_id: user.id,
                date: formData.date,
                type: formData.type==="Credit" ? "Expense": "Income",
                acc_1: res.data.id,
                acc_2: null,
                category: null,
                amount: formData.balance,
                is_source: true,
                pair_id: pairId,
                note: ""
            });
          
            handleClear();
            navigate("/accounts");
        }

        catch (err) {
            console.error("Account could not be added:", err);
        }
    };

    const handleClear = () => {
        setFormData({
            user_id: "",
            type: "",
            bank: "",
            balance: 0,
            date: new Date().toISOString(),
            last_digits: ""
        });
    };

    return (
        <div>
            <Logo />
            <Sidebar />

            <div className='container'>
                <div className='box border'>

                    <div className="span">

                        <button
                            title="back"
                            onClick={() => navigate("/accounts")}
                            className="transparent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                            </svg>
                        </button>

                        <div className="bold lg">Add Account</div>

                    </div>

                    <br />
                    <br />
                    <br />

                    <form onSubmit={handleSubmit}>

                        <div>

                            <div>

                                <strong>Type</strong>

                                <br />
                                <br />

                                <div className="span ml-6">

                                    <div
                                        className="span mr-2"
                                        onClick={() => handleType("Checking")}
                                    >
                                        <div className={`option-btn ${formData.type === "Checking" ? "selected" : ""}`}></div>
                                        <span>Checking</span>
                                    </div>

                                    <div
                                        className="span mr-2"
                                        onClick={() => handleType("Credit")}
                                    >
                                        <div className={`option-btn ${formData.type === "Credit" ? "selected" : ""}`}></div>
                                        <span>Credit</span>
                                    </div>

                                    <div
                                        className="span mr-2"
                                        onClick={() => handleType("Savings")}
                                    >
                                        <div className={`option-btn ${formData.type === "Savings" ? "selected" : ""}`}></div>
                                        <span>Savings</span>
                                    </div>

                                </div>

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Bank</strong>

                                <br />

                                <input
                                    type="text"
                                    title="bank"
                                    name="bank"
                                    id="bank"
                                    value={formData.bank}
                                    onChange={handleChange}
                                    className="border ml-6 mt input"
                                />

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Balance</strong>

                                <br />

                                <input
                                    title="balance"
                                    type="number"
                                    step="0.01"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleChange}
                                    className="border ml-6 mt input"
                                />

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Date</strong>

                                <br />

                                <input
                                    title="date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="border ml-6 mt input"
                                />

                            </div>

                            <br />
                            <br />

                            <div>

                                <strong>Last 4 digits</strong>

                                <br />

                                <input
                                    type="text"
                                    title="last_digits"
                                    name="last_digits"
                                    id="last_digits"
                                    maxLength={4}
                                    value={formData.last_digits}
                                    onChange={handleChange}
                                    className="border ml-6 mt input"
                                />

                            </div>

                        </div>

                        <br />
                        <br />
                        <br />

                        <div className="span set-buttons">

                            <button
                                type="button"
                                className="red-btn btn"
                                onClick={handleClear}
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="green-btn btn"
                                disabled={!isFormValid}

                            >
                                Add
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default Account;