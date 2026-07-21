import { useState, useEffect } from "react";
import Logo from "../../Shared/Logo/Logo";
import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar";
import './Entry.css';
import axios from "axios";
import type { AccountDto } from "../../../DTOs/account";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Entry = () => {

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [checkingAccounts, setCheckingAccounts] = useState<AccountDto[]>([]);
    const [savingsAccounts, setSavingsAccounts] = useState<AccountDto[]>([]);
    const [creditAccounts, setCreditAccounts] = useState<AccountDto[]>([]);

    const [selectedFrom, setSelectedFrom] = useState<AccountDto | null>(null);
    const [selectedTo, setSelectedTo] = useState<AccountDto | null>(null);

    const accounts = [
        ...checkingAccounts,
        ...savingsAccounts,
        ...creditAccounts
    ];

    const pairId = String(uuidv4());

    const [formData, setFormData] = useState({
        user_id: user.id,
        date: new Date().toISOString(),
        type: "",
        acc_1: "",
        acc_2: "",
        category: "",
        amount: "",
        note: ""
    });

    const isTransfer = formData.type === "Transfer";

    useEffect(() => {

        const fetchAccounts = async () => {
            try {
                const checking = await axios.get(`${apiUrl}/accounts/${user.id}/Checking`);
                const credit = await axios.get(`${apiUrl}/accounts/${user.id}/Credit`);
                const savings = await axios.get(`${apiUrl}/accounts/${user.id}/Savings`);

                setCheckingAccounts(checking.data);
                setCreditAccounts(credit.data);
                setSavingsAccounts(savings.data);

            } catch (err) {
                console.error("Failed to fetch accounts:", err);
            }
        };

        fetchAccounts();

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleType = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            type,
        }));

        if (type !== "Transfer") {
            setSelectedTo(null);
        }
    };

    const handleCategory = (category: string) => {
        setFormData((prev) => ({
            ...prev,
            category
        }));
    };

    const isValid = () => {
        if (!formData.type) return false;
        if (!formData.acc_1) return false;
        if (!formData.date) return false;
        if (!formData.amount) return false;

        if (formData.type !== "Income" && formData.type !== "Transfer") {
            if (!formData.category) return false;
        }

        if (formData.type === "Transfer" && !formData.acc_2) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isValid()) return;

        try {

            const amount = Number(formData.amount);

            const acc1 = await axios.get(`${apiUrl}/accounts/${formData.acc_1}`);

            if (formData.type === "Expense") {

                if (acc1.data.type === "Credit") {
                    acc1.data.balance += amount;
                } else {
                    acc1.data.balance -= amount;
                }

                await axios.post(`${apiUrl}/transactions`, {
                    user_id: formData.user_id,
                    date: formData.date,
                    type: formData.type,
                    acc_1: formData.acc_1,
                    acc_2: null,
                    category: formData.category,
                    pair_id: pairId,
                    is_source: true,
                    amount: amount,
                    note: formData.note
                });

            }

            else if (formData.type === "Income") {

                if (acc1.data.type === "Credit") {
                    acc1.data.balance -= amount;
                } else {
                    acc1.data.balance += amount;
                }

                await axios.post(`${apiUrl}/transactions`, {
                    user_id: formData.user_id,
                    date: formData.date,
                    type: formData.type,
                    acc_1: formData.acc_1,
                    acc_2: null,
                    category: formData.category,
                    pair_id: pairId,
                    is_source: true,
                    amount: amount,
                    note: formData.note
                });

            }

            else {

                const acc2 = await axios.get(`${apiUrl}/accounts/${formData.acc_2}`);

                if (acc1.data.type !== "Credit") {
                    acc1.data.balance -= amount;
                    acc2.data.balance += amount;
                }
                else if (acc1.data.type === "Credit") {
                    acc1.data.balance += amount;
                    acc2.data.balance += amount;
                }

                await axios.post(`${apiUrl}/transactions`, {
                    user_id: formData.user_id,
                    date: formData.date,
                    type: formData.type,
                    acc_1: formData.acc_1,
                    acc_2: acc2.data.id,
                    category: formData.category,
                    is_source: true,
                    amount: amount,
                    pair_id: pairId,
                    note: formData.note
                });

                await axios.post(`${apiUrl}/transactions`, {
                    user_id: formData.user_id,
                    date: formData.date,
                    type: formData.type,
                    acc_1: formData.acc_2,
                    acc_2: formData.acc_1,
                    category: formData.category,
                    amount: amount,
                    pair_id: pairId,
                    note: formData.note
                });
            }

            handleClear();
            navigate("/transactions");

        } catch (err) {
            console.error("Transaction cannot be created:", err);
        }
    };

    const handleClear = () => {
        setSelectedFrom(null);
        setSelectedTo(null);

        setFormData({
            user_id: user.id,
            date: new Date().toISOString(),
            type: "",
            acc_1: "",
            acc_2: "",
            category: "",
            amount: "",
            note: ""
        });
    };

    return (
        <div>
            <Logo />
            <Sidebar />

            <div className='container'>
                <div className='box border'>

                    <div className="bold lg">New Transaction Entry</div>

                    <br /><br /><br />

                    {
                        accounts.length === 0 ?
                            <div className="center sub">Make sure to add an account first</div> :

                            <form onSubmit={handleSubmit}>

                                <div>

                                    <div className="span">
                                        <strong className="mr-2">Date</strong>
                                        <input
                                            title="date"
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="border input"
                                        />
                                    </div>

                                    <br />

                                    <div>
                                        <strong>Type</strong>

                                        <div className="span mt ml-4">

                                            <div className="span mr-2" onClick={() => handleType("Income")}>
                                                <div className={`option-btn ${formData.type === "Income" ? "selected" : ""}`}></div>
                                                <span>Income</span>
                                            </div>

                                            <div className="span mr-2" onClick={() => handleType("Expense")}>
                                                <div className={`option-btn ${formData.type === "Expense" ? "selected" : ""}`}></div>
                                                <span>Expense</span>
                                            </div>

                                            <div className="span mr-2" onClick={() => handleType("Transfer")}>
                                                <div className={`option-btn ${formData.type === "Transfer" ? "selected" : ""}`}></div>
                                                <span>Transfer</span>
                                            </div>

                                        </div>
                                    </div>

                                    <br />

                                    <div className="span">

                                        <div className="span">
                                            <strong>Source</strong>

                                            <div className="span ml-2 mr-2 digits-parent">

                                                <span>
                                                    {selectedFrom ? selectedFrom.last_digits : "Select"}
                                                </span>

                                                <div className="border digits-child">
                                                    {accounts.map((acc) => (
                                                        <div
                                                            key={acc.id}
                                                            className="pointer"
                                                            onClick={() => {
                                                                setSelectedFrom(acc);
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    acc_1: acc.id!
                                                                }));
                                                            }}
                                                        >
                                                            {acc.last_digits}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>

                                        {isTransfer && (
                                            <div className="span">
                                                <strong>Destination</strong>

                                                <div className="span ml-2 mr-2 digits-parent">

                                                    <span>
                                                        {selectedTo ? selectedTo.last_digits : "Select"}
                                                    </span>

                                                    <div className="border digits-child">
                                                        {accounts.map((acc) => (
                                                            <div
                                                                key={acc.id}
                                                                className="pointer"
                                                                onClick={() => {
                                                                    setSelectedTo(acc);
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        acc_2: acc.id!
                                                                    }));
                                                                }}
                                                            >
                                                                {acc.last_digits}
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <br />

                                    {(formData.type !== "Transfer" && formData.type !== "Income") && (
                                        <div>
                                            <strong>Category</strong>

                                            <div className="mt ml-4">

                                                {["Essentials", "Lifestyle", "Growth", "Misc"].map((c) => (
                                                    <div key={c} className="span" onClick={() => handleCategory(c)}>
                                                        <div className={`option-btn ${formData.category === c ? "selected" : ""}`}></div>
                                                        <span>{c}</span>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    )}

                                    <br />

                                    <div className="span">
                                        <strong>Amount</strong>
                                        <input
                                            title="amount"
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            className="border ml-2 input"
                                        />
                                    </div>

                                    <br />

                                    <div className="span">
                                        <strong>Note</strong>
                                        <input
                                            title="note"
                                            type="text"
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            className="border ml-2 input"
                                        />
                                    </div>

                                </div>

                                <br /><br />

                                <div className="span set-buttons">

                                    <button type="button" className="red-btn btn" onClick={handleClear}>
                                        Clear
                                    </button>

                                    <button className="green-btn btn" type="submit">
                                        Add
                                    </button>

                                </div>

                            </form>
                    }

                </div>
            </div>
        </div>
    );
};

export default Entry;