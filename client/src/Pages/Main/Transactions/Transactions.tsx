import './Transactions.css';
import Logo from '../../Shared/Logo/Logo';
import Sidebar from '../../Shared/Navigation/Sidebar/Sidebar';
import { CompactNumber } from '../../../Services/CompactNumber';
import { useState, useEffect } from 'react';
import type { TransactionDto } from '../../../DTOs/transaction';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from '../../Shared/Popup/Popup';

const Transactions = () => {

    const [page, setPage] = useState(1);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [selectedType, setSelectedType] = useState("Checking");
    const [showPopup, setShowPopup] = useState(false);
    const [transactionType, setTransactionType] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    const entities = [
        "Date", "Type", "Account", "Amount", "Inflow", "Outflow", "Balance"
    ];

    const getTransactions = async (type: string, transaction_type: string | null) => {
        const res = await axios.get(`${apiUrl}/transactions`, {
            params: {
                user_id: user.id!,
                account_type: type,
                transaction_type: transaction_type,
                page_num: page,
            }
        });

        return res.data;
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions(selectedType, transactionType);
                console.log("DATA:", data);

                setTransactions(data.transactions || []);
                setTotalPages(data.total_pages || 1);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchTransactions();
    }, [selectedType, page, transactionType]);

    const chronological = [...transactions].slice().reverse();

    let runningBalance = 0;

    const balances = chronological.map((t) => {
        if (t.type === "Income") runningBalance += t.amount;
        else if (t.type === "Expense") runningBalance -= t.amount;
        else if (t.type === "Transfer") {
            runningBalance += t.is_source ? -t.amount : t.amount;
        }

        return runningBalance;
    });

    const transactionsWithBalance = transactions.map((transaction, i) => {

        let inflow = false;
        let outflow = false;

        if (transaction.type === "Income") {
            inflow = true;
        } 
        
        else if (transaction.type === "Expense") {
            outflow = true;
        } 
        
        else if (transaction.type === "Transfer") {
            transaction.is_source ? outflow = true : inflow = true;
        }
        
        const balancesReversed = [...balances].reverse();
        return {
            transaction,
            inflow,
            outflow,
            balance: balancesReversed[i]
        };
    });

    return (
        <div>
            <Logo />
            <Sidebar />

            <div className='container'>
           
                <div className='box border'>
                    {showPopup && (
                        <Popup
                            value={transactionType}

                            onSelect={(type) => {
                                setTransactionType(type)
                                setShowPopup(false)
                            }}

                            onClose={() => setShowPopup(false)}
                        />
                        )}
                    

                    <div className="span heading">
                        <div className="bold lg">Transactions</div>

                        <div className='span'>
                            <div className='green border span types-parent'>
                                <div>{selectedType}</div>

                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                    <path d="M480-357.85 253.85-584 296-626.15l184 184 184-184L706.15-584 480-357.85Z" />
                                </svg>

                                <div className="types-child border">
                                    <div onClick={() => setSelectedType("Checking")}>Checking</div>
                                    <div onClick={() => setSelectedType("Credit")}>Credit</div>
                                    <div onClick={() => setSelectedType("Savings")}>Savings</div>
                                </div>
                            </div>
                            <button title='filter' className='transparent' onClick={()=>{setShowPopup(true)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#938D8D"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg>
                            </button>
                        </div>
                    </div>

                    <br /><br /><br />

                    {transactions.length === 0 ? (
                        <div className="sub center">
                            No data available
                        </div>
                    ) : (

                        <table>
                            <thead>
                                <tr className="span divider">
                                    {entities.map((entity, index) => (
                                        <th key={index} className="bold rows">
                                            {entity}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {transactionsWithBalance.map(({ transaction, inflow, outflow, balance }) => {

                                    return (
                                        <tr
                                            key={transaction.id}
                                            className='span divider'
                                            onClick={() => {
                                                navigate("/details", {
                                                    state: { transaction }
                                                });
                                            }}
                                        >
                                            <td>
                                                {new Date(transaction.date + "T12:00:00").toLocaleDateString('en-US')}
                                            </td>

                                            <td>{transaction.type}</td>

                                            <td className='gap-5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#938D8D">
                                                    <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
                                                </svg>

                                                {transaction.acc_1_r.last_digits}
                                            </td>

                                            <td>
                                                <span className='sub mr-5'>$</span>
                                                {CompactNumber(transaction.amount)}
                                            </td>

                                            <td>
                                                {inflow && (
                                                    <div className="debit">
                                                        <span className='sub mr-5'>$</span>
                                                        {CompactNumber(transaction.amount)}
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                {outflow && (
                                                    <div className="credit">
                                                        <span className='sub mr-5'>$</span>
                                                        {CompactNumber(transaction.amount)}
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                <span className='sub mr-5'>$
                                                {selectedType === "Credit" 
                                                    ? CompactNumber((balance)*-1) 
                                                    : CompactNumber(balance)
                                                }
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    <div className={`${totalPages === 0 ? "hidden" : "pages sub xs span"}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                            onClick={() => {
                                if (page > 1) setPage(page - 1);
                            }}
                            className={`page-btn ${page <= 1 ? "disabled" : ""}`}
                        >
                            <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                        </svg>

                        <div>
                            Pages <strong>{page}</strong> / {totalPages}
                        </div>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#000000"
                            onClick={() => {
                                if (page < totalPages) setPage(page + 1);
                            }}
                            className={`page-btn ${page >= totalPages ? "disabled" : ""}`}
                        >
                            <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
                        </svg>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Transactions;