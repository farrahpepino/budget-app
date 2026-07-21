import Sidebar from "../../Shared/Navigation/Sidebar/Sidebar"
import './Home.css'
import Logo from "../../Shared/Logo/Logo"
import { useState, useEffect } from "react"
import { GetBalance } from "../../../Services/GetBalance"
import ExpensePie from "../../../Services/ExpensePie"
import axios from "axios"
import React from "react"

const Home = () => {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;
  const apiUrl = import.meta.env.VITE_API_URL; 

  const [balances, setBalances] = useState({
    Checking: 0,
    Credit: 0,
    Savings: 0
  });

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState([])

  useEffect(() => {

    const fetchBalances = async () => {
      const [checkingBalance, creditBalance, savingsBalance] = await Promise.all([
        GetBalance("Checking"),
        GetBalance("Credit"),
        GetBalance("Savings")
      ]);

      setBalances({
        Checking: checkingBalance,
        Credit: creditBalance,
        Savings: savingsBalance
      });
      setLoaded(true);
    };

    fetchBalances();

    const getPieData = async () => {
      try {
          const res = await axios.get(
              `${apiUrl}/transactions/${userId}/chart`
          );

          setData(res.data);
      } catch (err) {
          console.error("Failed to fetch pie chart data:", err);
      }
  };

  getPieData();
    

  }, [userId]);

  const types = ["Checking", "Credit", "Savings"] as const;

  const hasData =
    balances.Checking !== 0 ||
    balances.Credit !== 0 ||
    balances.Savings !== 0;

  const [showExpenses, setShowExpenses] = useState(true);

  const toggleExpense = () => {
    setShowExpenses(prev => !prev);
  }

  return (
    <div className="Home">
      <Logo />
      <Sidebar />

      {!loaded ? (
        <div className="container sub">
          <div className="center v-center">Loading...</div>
        </div>
      ) : !hasData ? (
        <div className="container sub">
          <div className="center v-center">No data available</div>
        </div>
      ) : (
        <div className="container">
          <div className="balances-box border">
            <div className="bold lg">Balances</div>
            <br />

            {types.map((type) =>
            
              balances[type] !== 0 ? (
                <div key={type} className="balance-span">
                  <div className="bold">{type}</div>
                  <div className={`${type === "Credit" ? "sub-c" : ""}`}>
{/*                     
                    {balances[type].toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} */}
                      {(type === "Credit" 
                      ? Math.abs(balances[type]) 
                      : balances[type]
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}

                    <span className="sub"> USD</span>
                  </div>
                </div>
              ) : null
            )}

          </div>

          <br />
          <br />

          <div className="tracker">
            <div className="bold lg span">
              <div>Track where your money goes</div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"  onClick={toggleExpense}
                  className={showExpenses ? "rotate" : ""}
                  >
                <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
              </svg>
            </div>
            {showExpenses && (
              <div>
                <ExpensePie data={data} />
              </div>
            )}
          </div>

          <br />
          <br />

          {/* <button
            className="transparent underline black ml-5 w-11"
            onClick={() => navigate("/statements")}
          >
            See past monthly statements
          </button> */}
        </div>
      )}
    </div>
  )
}

export default Home