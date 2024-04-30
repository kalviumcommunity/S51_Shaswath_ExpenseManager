import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TransactionForm.css';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    amount: '',
    category: '',
    description: '',
    mode: '',
    image: null, // New state to store the selected image file
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Update image state with the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getCookie('token');
      let userId = getCookie("id");
      formData.user = userId;

      const formDataWithImage = new FormData(); // Create FormData object for sending image
      for (const key in formData) {
        formDataWithImage.append(key, formData[key]);
      }

      const response = await axios.post('https://expensemanager-2t8j.onrender.com/add', formDataWithImage, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for uploading files
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
        image: null, // Reset image state after successful submission
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
  const onClose = () => {
    navigate('/')
  }
  return (
    <div className="register">
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label>Title</label>
          <input type="text" id="title" name="title" placeholder="Title" required value={formData.title} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Date</label>
          <input type="date" id="date" name="date" placeholder="Date" required value={formData.date} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Amount</label>
          <input type="number" id="amount" name="amount" placeholder="Amount" required value={formData.amount} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Category</label>
          <select className='select' id="category" name="category" value={formData.category} required onChange={handleChange}>
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
          <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        </div>

        <div className="input-group">
          <label>Type</label>
          <select className='select' id="mode" name="mode" value={formData.mode} required onChange={handleChange}>
            <option value="">Select type</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>
        </div>

        <div className="input-group">
          <label>Image</label>
          <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
        </div>
        <button type="submit" id='button'>Submit</button>
        <button type="button" id='button' onClick={onClose}>Close</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;
