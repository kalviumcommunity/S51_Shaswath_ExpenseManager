import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './Remainders.css';

function Remainders({ userId }) {
    const [remainders, setRemainders] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        amount: '',
        mode: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchRemainders();
    }, []);

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
        } catch (error) {
            console.error('Error adding or updating remainder:', error);
        }
    };

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
        <div className='remainder-body'>
            {!showModal ? (
                <>
                <h1>Remainders</h1>
                    <div>
                        {remainders.filter(remainder => remainder.user === userId).length > 0 ? (
                            <table className='remainder-table'>
                                <tbody>
                                    {remainders.map((remainder, index) => (
                                        remainder.user === userId && (
                                            <tr key={index}>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.title}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{new Date(remainder.date).toLocaleDateString()}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.amount}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.mode}</td>
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

                    </>
            ) : (
                <div className="editRem">
                    <h2 className="form-heading">{editIndex !== null ? 'Edit Reminder' : 'Add New Reminder'}</h2>
                    <form onSubmit={handleAddRemainder} className="form-container">
                        <div className="input-group">
                            <label htmlFor="title" className="form-label">Title:</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="date" className="form-label">Date:</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="amount" className="form-label">Amount:</label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="mode" className="form-label">Mode:</label>
                            <select name="mode" value={formData.mode} onChange={handleInputChange} required className="form-input">
                                <option value="">Select Type</option>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                            </select>
                        </div>
                        <button type="submit" className="form-button">{editIndex !== null ? 'Save' : 'Add'}</button>
                        <button type="button" onClick={handleCloseModal} className="form-button">Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Remainders;
