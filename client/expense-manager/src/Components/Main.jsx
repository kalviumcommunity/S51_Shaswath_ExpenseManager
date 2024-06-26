import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PieChartIcon from '@mui/icons-material/PieChart';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Main.css'




export default function Main({userId}) {
    const [showForm, setShowForm] = useState(false);
    const [data, setData] = useState([]);
    // const [userId, setUserId] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [filter, setFilter] = useState([])
    const [selectedCreator, setSelectedCreator] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');



    useEffect(() => {
        fetchTransaction();
        // const userId = getCookie("id");
        // setUserId(userId);
    }, []);

    useEffect(() => {
        extractUniqueCreators()
    }, [data])

    const handleCreatorChange = (e) => {
        setSelectedCreator(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };


    const fetchTransaction = async () => {
        try {
            const res = await fetch("https://expensemanager-2t8j.onrender.com/get");
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            console.log(data);
            console.log(userId)
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

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'list' ? 'pie' : 'list');
    };

    const extractUniqueCreators = () => {
        const filter = [...new Set(data.map(item => item.mode))];
        setFilter(filter);
    };

    const filterByDateRange = (transactions) => {
        if (!startDate || !endDate) {
            return transactions; // No date range selected, return all transactions
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= start && transactionDate <= end;
        });
    };

    const filteredByDate = filterByDateRange(data);
    const filteredData = selectedCreator ? filteredByDate.filter(item => item.mode === selectedCreator) : filteredByDate;

    return (
        <div className='TransactionBody'>
            <div className='mainn'>



                <div className='iconDiv'>
                    {viewMode === 'list' ? (
                        <PieChartIcon fontSize='large' className='icon' onClick={toggleViewMode} />
                    ) : (
                        <FormatListBulletedIcon fontSize='large' className='icon' onClick={toggleViewMode} />
                    )}
                </div>
            </div>

            <br />
            <div className='sorting'>
                <div className="filter">
                    <select className='sort' id="createdBy" value={selectedCreator} onChange={handleCreatorChange}>
                        <option value="">All</option>
                        {filter.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="date-picker">
                    <div>
                        <label htmlFor="startDate">From:</label>
                        <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />
                    </div>
                    <div>
                        <label htmlFor="endDate">To:</label>
                        <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
                    </div>
                </div>
            </div>
            {/* {showForm && <TransactionForm onClose={handleCloseForm} />} */}
            {!showForm && <div className='ttables'>
                <h2>Transactions</h2>
                {data.length >= 0 ? (
                    <table className='remainder-table'>
                        <tbody>
                            {filteredData.map(transaction => (
                                transaction.user === userId ? (
                                    <tr key={transaction._id}>
                                        {/* <td>{transaction.user}</td> */}
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
                                        <td>
                                            {transaction.imageUrl ? (
                                                <Link className='link'  to='/images'>
                                                    <div>Image Avaliable</div>
                                                </Link>
                                            ) : (
                                                <div>No Image Avaliable</div>
                                            )}
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
        </div>
    );
}
