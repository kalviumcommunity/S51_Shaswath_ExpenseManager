import React, { useState } from 'react';
import axios from 'axios';
import './TransactionForm.css';

const TransactionForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    amount: '',
    category: '',
    description: '',
    mode: '',
  });
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie('token');
      let userId = getCookie("id");
      formData.user = userId;
      const response = await axios.post('https://expensemanager-2t8j.onrender.com/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Transaction added successfully:', response.data.transaction);
      setFormData({
        title: '',
        date: '',
        amount: '',
        category: '',
        description: '',
        mode: '',
      });
      setError('');
      alert('Transaction added successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          <input type="text" id="title" name="title" placeholder="Title" required value={formData.title} onChange={handleChange} />
          <span>Title</span>
        </label>
        <label htmlFor="date">
          <input type="date" id="date" name="date" required value={formData.date} onChange={handleChange} />
          <span>Date</span>
        </label>
        <label htmlFor="amount">
          <input type="number" id="amount" name="amount" placeholder="Amount" required value={formData.amount} onChange={handleChange} />
          <span>Amount</span>
        </label>
        <label htmlFor="category">
          <select id="category" name="category" value={formData.category} required onChange={handleChange}>
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
          <input type="text" id="description" name="description" placeholder="Description" required value={formData.description} onChange={handleChange} />
          <span>Description</span>
        </label>
        <label htmlFor="mode">
          <select id="mode" name="mode" value={formData.mode} required onChange={handleChange}>
            <option value="">Select type</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
          <span>Type</span>
        </label>
        <button type="submit" id='button'>Submit</button>
        <button type="button" id='button' onClick={onClose}>Close</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;
