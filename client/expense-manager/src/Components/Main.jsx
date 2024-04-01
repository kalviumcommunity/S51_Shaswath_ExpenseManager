import React, { useState, useEffect } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PieChartIcon from '@mui/icons-material/PieChart';
import TransactionForm from './TransactionForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "./Main.css"
import { Link } from "react-router-dom"
import axios from 'axios';

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

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this transaction?");
            if (confirmed) {
                const response = await axios.delete(`https://expensemanager-2t8j.onrender.com/delete/${id}`);
                if (response.status === 200) {
                    setData(data.filter(transaction => transaction._id !== id));
                    console.log("Transaction deleted successfully");
                } else {
                    console.log("Failed to delete transaction");
                }
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
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
            <br />
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(transaction => (
                                transaction.user === userId ? (
                                    <tr key={transaction._id}>
                                        <td>{transaction.title}</td>
                                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.category}</td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.mode}</td>
                                        <td id='actions'>
                                            <Link className='link' to={`/edit/${transaction._id}`}><EditIcon className="action-button" /></Link>
                                            <DeleteIcon className="action-button" onClick={() => handleDelete(transaction._id)} />
                                        </td>
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
