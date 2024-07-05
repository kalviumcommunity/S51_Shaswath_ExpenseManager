import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Main.css';

const Main = ({ userId }) => {
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [filter, setFilter] = useState([]);
    const [selectedCreator, setSelectedCreator] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        date: '',
        amount: '',
        category: '',
        description: '',
        mode: '',
        image: null,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchTransaction();
    }, []);

    useEffect(() => {
        extractUniqueCreators();
    }, [data]);

    useEffect(() => {
        if (id && showEditForm) {
            fetchTransactionDetails();
        }
    }, [id, showEditForm]);

    const fetchTransaction = async () => {
        try {
            const res = await fetch("https://expensemanager-2t8j.onrender.com/get");
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            setData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTransactionDetails = async () => {
        try {
            const response = await axios.get(`https://expensemanager-2t8j.onrender.com/gett/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            setError('Error fetching transaction details. Please try again later.');
        }
    };

    const handleCreatorChange = (e) => {
        setSelectedCreator(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleEdit = (transactionId) => {
        setShowEditForm(true);
        navigate(`/edit/${transactionId}`);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataWithImage = new FormData();
            for (const key in formData) {
                formDataWithImage.append(key, formData[key]);
            }

            const response = await axios.patch(`https://expensemanager-2t8j.onrender.com/update/${id}`, formDataWithImage, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Transaction updated successfully:', response.data.transaction);
            setError('');
            alert('Transaction updated successfully');
            setShowEditForm(false);
            navigate('/');
        } catch (error) {
            console.error('Error updating transaction:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        navigate('/');
    };

    return (
        <div className='TransactionBody'>
            <h2>Transactions</h2>
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
                        <label htmlFor="startDate"><b>From:</b></label>
                        <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />
                    </div>
                    <div>
                        <label htmlFor="endDate"><b>To:</b></label>
                        <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
                    </div>
                </div>
            </div>
            <div className='ttables'>
                {data.length > 0 ? (
                    <table className='remainder-table'>
                        <tbody>
                            {filteredData.map(transaction => (
                                <tr key={transaction._id}>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.title}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.amount}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.category}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.description}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.mode}</td>
                                    <td className={transaction.mode === "Credit" ? "credit" : "debit"} id='actions'>
                                        <EditIcon className="action-button" onClick={() => handleEdit(transaction._id)} />
                                        <DeleteIcon className="action-button" onClick={() => handleDelete(transaction._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h2>No Data</h2>
                )}
            </div>

            {showEditForm && (
                <div className="registerT">
                    <h2 className="form-heading">Edit Transaction</h2>
                    <form onSubmit={handleSubmit} className="form-container">

                        <div className="input-groupR">
                            <label className="form-label">Title</label>
                            <input type="text" id="title" name="title" placeholder="Title" className="form-input" required value={formData.title} onChange={handleChange} />
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Date</label>
                            <input type="date" id="date" name="date" placeholder="Date" required className="form-input" value={formData.date} onChange={handleChange} />
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Amount</label>
                            <input type="number" id="amount" name="amount" className="form-input" placeholder="Amount" required value={formData.amount} onChange={handleChange} />
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Category</label>
                            <select className="form-input" id="category" name="category" value={formData.category} required onChange={handleChange}>
                                <option value="">Select category</option>
                                <option value="Food">Food</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Rent">Rent</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Education">Education</option>
                                <option value="Travel">Travel</option>
                                <option value="Salary">Salary</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Description</label>
                            <input required type="text" id="description" className="form-input" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Type</label>
                            <select className="form-input" id="mode" name="mode" value={formData.mode} required onChange={handleChange}>
                                <option value="">Select type</option>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                            </select>
                        </div>

                        <div className="input-groupR">
                            <label className="form-label">Image</label>
                            <input className="form-input" type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
                        </div>
                        <button type="submit" className="form-button">Submit</button>
                        <button type="button" className="form-button" onClick={handleCloseEditForm}>Cancel</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default Main;
