import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Main.css';

const Main = ({ userId }) => {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [selectedCreator, setSelectedCreator] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        fetchTransaction();
    }, []);

    useEffect(() => {
        extractUniqueCreators();
    }, [data]);

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

    const handleCreatorChange = (e) => {
        setSelectedCreator(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
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

    const handleEditClick = (id) => {
        const transaction = data.find(item => item._id === id);
        if (transaction) {
            setTitle(transaction.title);
            setDate(transaction.date);
            setAmount(transaction.amount);
            setCategory(transaction.category);
            setDescription(transaction.description);
            setMode(transaction.mode);
            setEditTransactionId(id);
            setIsEditing(true);
        }
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setEditTransactionId(null);
        fetchTransaction(); // Refresh data after editing
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            // Your form submission logic goes here
            const formData = { title, date, amount, category, description, mode };
            console.log(formData);
            const response = await axios.patch(`https://expensemanager-2t8j.onrender.com/patch/${editTransactionId}`, formData)
            if (response.status === 200) {
                console.log('Updated Transaction:', response.data);
                handleCloseEdit();
            } else {
                console.error('Update failed:', response.data.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='TransactionBody'>
            <h2>Transactions</h2>
            <br />
            {isEditing ? (
                    <div className="editRem">
                        <form onSubmit={handleSubmit} className='form-container'>
                            <div className='input-groupR'>
                                <label className='form-label'>Title</label>
                                <input type="text"
                                    id="title"
                                    name="title"
                                    className='form-input'
                                    placeholder="Title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="input-groupR">
                                <label className="form-label">Date</label>
                                <input type="date" id="date" name="date" placeholder="Date" required className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <div className="input-groupR">
                                <label className="form-label">Amount</label>
                                <input type="number" id="amount" name="amount" className="form-input" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </div>

                            <div className="input-groupR">
                                <label className="form-label">Category</label>
                                <select className="form-input" id="category" name="category" value={category} required onChange={(e) => setCategory(e.target.value)}
                                >
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
                                <input required type="text" id="description" className="form-input" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                            </div>

                            <div className="input-groupR">
                                <label className="form-label">Type</label>
                                <select className="form-input" id="mode" name="mode" value={mode} required onChange={(e) => setMode(e.target.value)}>
                                    <option value="">Select type</option>
                                    <option value="Credit">Credit</option>
                                    <option value="Debit">Debit</option>
                                </select>
                            </div>

                            <button type="submit" className="form-button" id='button'>
                                Submit
                            </button>
                            <button type="button" className="form-button" id='button' onClick={handleCloseEdit}>
                                Close
                            </button>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
            ) : (
                <>
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
                                                <EditIcon className="action-button" onClick={() => handleEditClick(transaction._id)} />
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
                </>
            )}
        </div>
    );
};

export default Main;
