import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Overview() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const { userId } = useParams();

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

    console.log("userId:", userId); // Log userId
    console.log("data:", data);     // Log fetched data

    
    const debitTransactions = data.filter(transaction => transaction.user === userId && transaction.mode === 'Debit');
    const creditTransactions = data.filter(transaction => transaction.user === userId && transaction.mode === 'Credit');


    const totalDebitAmount = debitTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalCreditAmount = creditTransactions.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <>
            <div>
                <h1>Debit Transactions:</h1>
                <p>No of Transactions: {debitTransactions.length}</p>
                <p>Total Amount: {totalDebitAmount}</p>
            </div>
            <div>
                <h1>Credit Transactions:</h1>
                <p>No of Transactions: {creditTransactions.length}</p>
                <p>Total Amount: {totalCreditAmount}</p>
            </div>
            <div>
                <h1>Summary:</h1>
                <p>Amount spent: {totalDebitAmount}</p>
                <p>Amount received: {totalCreditAmount}</p>
                <p>Balance: {totalCreditAmount - totalDebitAmount}</p>
            </div>
        </>
    );
    
}
