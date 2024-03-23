import React, { useState, useEffect } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PieChartIcon from '@mui/icons-material/PieChart';
import TransactionForm from './TransactionForm';
import "./Main.css"

export default function Main() {
    const [showForm, setShowForm] = useState(false);
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        fetchTransaction();
        const userId = getCookie("id");
        setUserId(userId);
    }, []);

    const getCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    };

    const fetchTransaction = async () => {
        try {
            const res = await fetch("https://expensemanager-2t8j.onrender.com/get");
            const data = await res.json();
            console.log(data);
            setData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddNewTransaction = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <>
            <div className='mainn'>
                <button className='login' onClick={handleAddNewTransaction}>Add New Transaction</button>
                <div className='iconDiv'>
                    <FormatListBulletedIcon fontSize='large' className='icon' />
                    <PieChartIcon fontSize='large' className='icon' />
                </div>
            </div>
            {showForm && <TransactionForm onClose={handleCloseForm} />}
            {!showForm && <div className='ttables'>
                <h2>Transactions</h2>
                {data.length >= 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Mode</th>
                                {/* <th>User</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(transaction => (
                                transaction.user === userId ? (
                                    <tr key={transaction._id}>
                                        <td>{transaction.title}</td>
                                        <td>{transaction.date.slice(0, 10)}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.mode}</td>
                                        {/* <td>{transaction.user}</td> */}
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h2>No Data</h2>
                )}
            </div>}
        </>
    );
}
