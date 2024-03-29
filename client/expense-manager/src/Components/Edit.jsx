import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Edit({ onClose }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            // Your form submission logic goes here
            const formData = { title, date, amount, category, description, mode };
            console.log(formData);
            navigate('/')

        } catch (err) {
            console.log(err)
        }

    };

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <span>Title</span>
                </label>
                <label htmlFor="date">
                    <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <span>Date</span>
                </label>
                <label htmlFor="amount">
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="Amount"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <span>Amount</span>
                </label>
                <label htmlFor="category">
                    <select
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
                    <span>Category</span>
                </label>
                <label htmlFor="description">
                    <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <span>Description</span>
                </label>
                <label htmlFor="mode">
                    <select
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
                    <span>Type</span>
                </label>
                <button type="submit" className="button">
                    Submit
                </button>
                <button type="button" className="button" onClick={onClose}>
                    Close
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}
