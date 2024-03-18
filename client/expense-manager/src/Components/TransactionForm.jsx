import React, { useState } from 'react';
import './TransactionForm.css'

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    amount: '',
    category: '',
    description: '',
    mode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit" className='submit'>Submit</button>
    </form>
  );
};

export default TransactionForm;
