import React, { useState, useEffect } from 'react';
import Income from '../assets/income.png';
import Expenses from '../assets/expenses.png';
import Debt from '../assets/debt.png'

export default function Overview({ userId }) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransaction();
    }, []);

    const fetchTransaction = async () => {
        try {
            const res = await fetch("https://expensemanager-2t8j.onrender.com/get");
            const data = await res.json();
            console.log("Fetched data:", data);
            setData(data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err);
        }
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    const debitTransactions = data.filter(transaction => transaction.user === userId && transaction.mode === 'Debit');
    const creditTransactions = data.filter(transaction => transaction.user === userId && transaction.mode === 'Credit');

    const totalDebitAmount = debitTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCreditAmount = creditTransactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className='overview-main'>
            <div>
                <img src={Expenses} alt="Income" />
                {/* <p>No of Transactions: {debitTransactions.length}</p> */}
                <div>
                <h4>Expense</h4>
                <h4>{totalDebitAmount}</h4>
                </div>
            </div>
            <div>
                <img src={Income} alt="Expenses" />
                {/* <p>No of Transactions: {creditTransactions.length}</p> */}
                <div>
                <h4>Income</h4>
                <h4>{totalCreditAmount}</h4>
                </div>
            </div>
            <div>
                <img src={Debt} alt="Expenses" />
                {/* <p>Amount spent: {totalDebitAmount}</p> */}
                {/* <p>Amount received: {totalCreditAmount}</p> */}
                <div>
                <h4>Balance</h4>
                <h4>{totalCreditAmount - totalDebitAmount}</h4>
                </div>
            </div>
        </div>
    );
}
