import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar";
import Logo from "../../Shared/Logo/Logo";
import "./TransactionDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const TransactionDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const apiUrl = import.meta.env.VITE_API_URL;

    const { transaction } = location.state as any;
    const [note, setNote] = useState(transaction.note || "");

    const saveTransaction = async () => {
        try {
            await axios.patch(`${apiUrl}/transaction/${transaction.id}`, note);
    
            navigate("/transactions");
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTransaction = async () => {
        try {
            const amount = parseFloat(transaction.amount);

            if (transaction.type == "Expense") {
                if (transaction.acc_1_r.type === "Credit") {
                    transaction.acc_1_r.balance =
                        transaction.acc_1_r.balance - amount;
                } else {
                    transaction.acc_1_r.balance =
                        transaction.acc_1_r.balance + amount;
                }

              
            } else if (transaction.type == "Income") {
                transaction.acc_1_r.balance =
                    transaction.acc_1_r.balance - amount;

              
            } else {
                if (transaction.acc_1_r.type !== "Credit") {
                    transaction.acc_1_r.balance =
                        transaction.acc_1_r.balance + amount;
                } else {
                    transaction.acc_1_r.balance =
                        transaction.acc_1_r.balance - amount;
                }


                if (transaction.acc_2_r) {
                    if (
                        transaction.acc_2_r.type == "Checking" ||
                        transaction.acc_2_r.type == "Savings"
                    ) {
                        transaction.acc_2_r.balance =
                            transaction.acc_2_r.balance - amount;
                    } else if (transaction.acc_2_r.type == "Credit") {
                        transaction.acc_2_r.balance =
                            transaction.acc_2_r.balance + amount;
                    }


                }
            }

            await axios.delete(`${apiUrl}/transaction/${transaction.id}`);
            navigate("/transactions");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Logo />
            <Sidebar />

            <div className="container">
                <div className="box border">
                    <div className="span">
                        <svg
                            onClick={() => navigate("/transactions")}
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                        >
                            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                        </svg>
                        <div className="bold lg">Transaction</div>
                    </div>

                    <br /><br /><br />

                    <div>
                        <div>
                            <strong>Date</strong>
                            <div className="ml-6 sub disabled">
                                {transaction.date}
                            </div>
                        </div>

                        <br />

                        <div>
                            <strong>Type</strong>
                            <div className="mt ml-6 sub disabled">
                                {transaction.type}
                            </div>
                        </div>

                        <br />

                        <div>
                            <strong>Category</strong>
                            <div className="mt ml-6 sub disabled">
                                {transaction.category}
                            </div>
                        </div>

                        <br />

                        <div>
                            <strong>Amount</strong>
                            <div className="ml-6 sub disabled">
                                {transaction.amount} USD
                            </div>
                        </div>

                        <br />

                        <div>
                            <strong>Note</strong>
                            <br />
                            <input
                            title="note"
                            type="text"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="input border ml-6"
                            />
                        </div>
                    </div>

                    <br /><br /><br />

                    <div className="span set-buttons">
                        <button className="red-btn btn" onClick={deleteTransaction}>
                            Delete
                        </button>

                        <button
                            className="green-btn btn"
                            onClick={saveTransaction}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;