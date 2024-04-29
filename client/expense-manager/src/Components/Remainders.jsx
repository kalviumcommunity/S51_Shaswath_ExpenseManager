import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Remainders({ userId, remindMe, setRemindMe }) {
    const [remainders, setRemainders] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        amount: '',
        mode: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    // const [remindMe, setRemindMe] = useState(false)

    useEffect(() => {
        fetchRemainders();
    }, []);

    useEffect(() => {
        handleRemind()
    }, [remainders]);
    useEffect(() => {
        if (editIndex !== null) {
            const remainderToEdit = remainders[editIndex];
            setFormData({
                title: remainderToEdit.title,
                date: remainderToEdit.date,
                amount: remainderToEdit.amount,
                mode: remainderToEdit.mode
            });
        } else {
            setFormData({
                title: '',
                date: '',
                amount: '',
                mode: ''
            });
        }
    }, [editIndex, remainders]);
    

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
            if (editIndex !== null) {
                const editedRemainder = remainders[editIndex];
                const response = await fetch(`https://expensemanager-2t8j.onrender.com/patchremainders/${editedRemainder._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (response.ok) {
                    const updatedRemainders = [...remainders];
                    updatedRemainders[editIndex] = data;
                    setRemainders(updatedRemainders);
                    alert('Remainder updated successfully');
                } else {
                    alert(data.error || 'Failed to update remainder');
                }
            } else {
                formData.user = userId;
                const response = await fetch('https://expensemanager-2t8j.onrender.com/addremainders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    fetchRemainders();
                } else {
                    alert(data.error || 'Failed to add remainder');
                }
            }
    
            setFormData({
                title: '',
                date: '',
                amount: '',
                mode: ''
            });
            setShowModal(false);
    
            // // Check if any reminder matches today's date
            // const today = new Date().toISOString().slice(0, 10);
            // const remindToday = remainders.some(reminder => reminder.date === today);
            // setRemindMe(remindToday);
    
        } catch (error) {
            console.error('Error adding or updating remainder:', error);
        }
    };

    const handleRemind = () => {
        const today = new Date().toISOString().slice(0,10);
        console.log(today); // Log today's date for reference
        
        const userReminders = remainders.filter(item => item.user === userId);
        console.log(userReminders.map(item => item.date)); // Log dates for the user
        
        const remindersToday = userReminders.filter(item => item.date.slice(0,10) === today);
        console.log(remindersToday.map(item => item.date)); // Log dates that match today's date for the user
        
        if (remindersToday.length > 0) {
            setRemindMe(true);
        } else {
            setRemindMe(false);
        }
    }
    
    

    const handleDeleteRemainder = async id => {
        try {
            const response = await fetch(`https://expensemanager-2t8j.onrender.com/deleteremainders/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setRemainders(remainders.filter(remainder => remainder._id !== id));
                alert('Remainder deleted successfully');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete remainder');
            }
        } catch (error) {
            console.error('Error deleting remainder:', error);
        }
    };

    const handleEditRemainder = index => {
        const remainderToEdit = remainders[index];
        setFormData({ ...remainderToEdit });
        setShowModal(true);
        setEditIndex(index);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditIndex(null);
    };

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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remainders.map((remainder, index) => (
                                remainder.user === userId && (
                                    <tr key={index}>
                                        <td>{remainder.title}</td>
                                        <td>{new Date(remainder.date).toLocaleDateString()}</td>
                                        <td>{remainder.amount}</td>
                                        <td>{remainder.mode}</td>
                                        <td>
                                            <EditIcon className="action-button" onClick={() => handleEditRemainder(index)} />
                                            <DeleteIcon className="action-button" onClick={() => handleDeleteRemainder(remainder._id)} />
                                        </td>
                                    </tr>
                                )
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
                    <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>{editIndex !== null ? 'Edit Remainder' : 'Add New Remainder'}</h2>
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
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', marginBottom: '15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{editIndex !== null ? 'Save' : 'Add'}</button>
                        <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Remainders;
