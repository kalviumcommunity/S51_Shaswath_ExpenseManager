import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Edit({ id, onClose }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await axios.get(`https://expensemanager-2t8j.onrender.com/gett/${id}`);
                if (response.status === 200) {
                    const data = response.data;

                    setTitle(data.title);
                    setDate(data.date);
                    setAmount(data.amount);
                    setCategory(data.category);
                    setDescription(data.description);
                    setMode(data.mode);
                } else {
                    console.log("Failed to fetch data");
                }
            } catch (err) {
                console.log("Error", err);
            }
        };
        fetchTransactionData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = { title, date, amount, category, description, mode };
            const response = await axios.patch(`https://expensemanager-2t8j.onrender.com/patch/${id}`, formData);
            if (response.status === 200) {
                console.log('Updated Transaction:', response.data);
                onClose();
            } else {
                console.error('Update failed:', response.data.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        
            <div className="registerT">
                <form onSubmit={handleSubmit} className='form-container'>
                    <div className='input-groupR'>
                        <label className='form-label'>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className='form-input'
                            placeholder="Title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="input-groupR">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            placeholder="Date"
                            required
                            className="form-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="input-groupR">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="form-input"
                            placeholder="Amount"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="input-groupR">
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            id="category"
                            name="category"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
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
                        <input
                            required
                            type="text"
                            id="description"
                            className="form-input"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                    </div>

                    <div className="input-groupR">
                        <label className="form-label">Type</label>
                        <select
                            className="form-input"
                            id="mode"
                            name="mode"
                            value={mode}
                            required
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="">Select type</option>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                        </select>
                    </div>

                    <button type="submit" className="form-button" id='button'>
                        Submit
                    </button>
                    <button type="button" className="form-button" id='button' onClick={onClose}>
                        Close
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>

    );
}
