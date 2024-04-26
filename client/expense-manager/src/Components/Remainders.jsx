import React, { useState, useEffect } from 'react';

function Remainders({ userId, setRemindMe }) {
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
            setShowModal(false);
            const today = new Date().toISOString().slice(0, 10);
            if (formData.date === today) {
                setRemindMe(true)
            }
        } catch (error) {
            console.error('Error adding remainder:', error);
        }
    };

    const onclose = () => {
        setShowModal(false)
    }

    return (
        <div>
            <h1>Remainders</h1>
            <div>
                {remainders.filter(remainder => remainder.user === userId).length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remainders.map((remainder, index) => (
                                remainder.user === userId ? (
                                    <tr key={index}>
                                        <td>{remainder.title}</td>
                                        <td>{remainder.date}</td>
                                        <td>{remainder.amount}</td>
                                        <td>{remainder.mode}</td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No remainders</p>
                )}
            </div>


            <button onClick={() => setShowModal(true)}>Add Remainder</button>

            {showModal && (
                <div id="add-remainder-modal" style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Add New Remainder</h2>
                    <form onSubmit={handleAddRemainder} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="title" style={{ marginBottom: '5px' }}>Title:</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required style={{ padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <label htmlFor="date" style={{ marginBottom: '5px' }}>Date:</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required style={{ padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <label htmlFor="amount" style={{ marginBottom: '5px' }}>Amount:</label>
                        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} required style={{ padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        <label htmlFor="mode" style={{ marginBottom: '5px' }}>Mode:</label>
                        <select name="mode" value={formData.mode} onChange={handleInputChange} required style={{ padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <option value="">Select Type</option>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                        </select>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', marginBottom: '15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                        <button type="button" onClick={onclose} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                    </form>
                </div>

            )}
        </div>
    );
}

export default Remainders;
