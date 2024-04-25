import React, { useState, useEffect } from 'react';

function Remainders({ userId }) {
  const [remainders, setRemainders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    amount: '',
    mode: ''
  });
  const [showModal, setShowModal] = useState(false); // State variable to manage modal visibility

  useEffect(() => {
    fetchRemainders();
  }, []);

  const fetchRemainders = async () => {
    try {
      const response = await fetch('https://expensemanager-2t8j.onrender.com/getremainders');
      const data = await response.json();
      setRemainders(data);
    } catch (error) {
      console.error('Error fetching remainders:', error);
    }
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRemainder = async event => {
    event.preventDefault();
    try {
      formData.user = userId;
      const response = await fetch('https://expensemanager-2t8j.onrender.com/addremainders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      alert(data.message);
      setFormData({
        title: '',
        date: '',
        amount: '',
        mode: ''
      });
      fetchRemainders();
      setShowModal(false); // Close modal after successful addition
    } catch (error) {
      console.error('Error adding remainder:', error);
    }
  };

  return (
    <div>
      <h1>Remainders</h1>
      <div>
        {remainders.map((remainder, index) => (
          remainder.user === userId ? (
            <div key={index}>
              <p>Title: {remainder.title}</p>
              <p>Date: {remainder.date}</p>
              <p>Amount: {remainder.amount}</p>
              <p>Mode: {remainder.mode}</p>
              <p>ID: {remainder.user}</p>
            </div>
          ) : null
        ))}
        {remainders.filter(remainder => remainder.user === userId).length === 0 && (
          <p>No remainders</p>
        )}
      </div>

      <button onClick={() => setShowModal(true)}>Add Remainder</button>

      {showModal && (
        <div id="add-remainder-modal">
          <h2>Add New Remainder</h2>
          <form onSubmit={handleAddRemainder}>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            <label htmlFor="amount">Amount:</label>
            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} required />
            <label htmlFor="mode">Mode:</label>
            <input type="text" id="mode" name="mode" value={formData.mode} onChange={handleInputChange} required />
            <button type="submit">Add</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Remainders;
