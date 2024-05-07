import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


export default function Edit() {
    const { id } = useParams()

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactionData = async () => {
            try {
                const response = await axios.get(`https://expensemanager-2t8j.onrender.com/get/${id}`);
                if (response.status === 200) {
                    const data = response.data

                    setTitle(data.title);
                    setDate(data.date);
                    setAmount(data.amount);
                    setCategory(data.category);
                    setDescription(data.description);
                    setMode(data.mode);
                }
                else {
                    console.log("Failed to fetch data")
                }
            } catch (err) {
                console.log("Error", err)
            }
        }
        fetchTransactionData()
    }, [id])

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };


    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.patch(`https://expensemanager-2t8j.onrender.com/patch/${id}`, {
                title: title,
                date: date,
                amount: amount,
                category: category,
                description: description,
                mode: mode
            })
            if (response.status === 200) {
                console.log('Updated Transaction:', response.data);
                navigate('/');
            } else {
                console.error('Update failed:', response.data.error);
            }

        } catch (error) {
            console.error("Error fetching transaction data:", error);
            setError("Error fetching transaction data. Please try again.");
        }
    };
    const close = () => {
        navigate('/')
    }
    
    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Title</label>
                    <input type="text" id="title" name="title" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Date</label>
                    <input type="date" id="date" name="date" placeholder="Date" required value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Amount</label>
                    <input type="number" id="amount" name="amount" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Category</label>
                    <select className='select' id="category" name="category" value={category} required onChange={(e) => setCategory(e.target.value)}>
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

                <div className="input-group">
                    <label>Description</label>
                    <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </div>

                <div className="input-group">
                    <label>Type</label>
                    <select className='select' id="mode" name="mode" value={mode} required onChange={(e) => setMode(e.target.value)}>
                        <option value="">Select type</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor='image'>Image</label>
                    <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
                </div>
                <button type="submit" id='button'>Submit</button>
                <button type="button" id='button' onClick={close}>Close</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}
