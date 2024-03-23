import React, { useState } from 'react';
import axios from 'axios';
import './TransactionForm.css';

const TransactionForm = ({onClose}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    amount: '',
    category: '',
    description: '',
    mode: '',
  });
  const [error, setError] = useState('');

  // Function to get cookie by name
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
      const token = getCookie('token'); // Get token from cookies
      let userId = getCookie("id")
      console.log(userId)
      formData.user = userId
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
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <label className="label-t">Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} className="inputText-t" />

      <label className="label-t">Date:</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="inputText-t" />

      <label className="label-t">Amount:</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="inputText-t" />

      <label className="label-t">Category:</label>
      <input type="text" name="category" value={formData.category} onChange={handleChange} className="inputText-t" />

      <label className="label-t">Description:</label>
      <input type="text" name="description" value={formData.description} onChange={handleChange} className="inputText-t" />

      <label className="label-t">Mode:</label>
      <input type="text" name="mode" value={formData.mode} onChange={handleChange} className="inputText-t" />

      <button type="submit" className="submit">Submit</button>
      <button className='submit' onClick={onClose}>Close</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default TransactionForm;
