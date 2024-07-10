import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
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
    const [editRemainderId, setEditRemainderId] = useState(null);

    useEffect(() => {
        fetchRemainders();
    }, []);

    useEffect(() => {
        if (editRemainderId !== null) {
            const remainderToEdit = remainders.find(remainder => remainder._id === editRemainderId);
            if (remainderToEdit) {
                setFormData({
                    title: remainderToEdit.title,
                    date: remainderToEdit.date,
                    amount: remainderToEdit.amount,
                    mode: remainderToEdit.mode
                });
                setShowModal(true);
            }
        } else {
            setFormData({
                title: '',
                date: '',
                amount: '',
                mode: ''
            });
            setShowModal(false);
        }
    }, [editRemainderId, remainders]);

    const fetchRemainders = async () => {
        try {
            const response = await fetch('http://localhost:7777/getremainders');
            if (!response.ok) {
                throw new Error('Failed to fetch remainders');
            }
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

    const handleEditRemainder = id => {
        setEditRemainderId(id);
    };

    const handleCloseModal = () => {
        setEditRemainderId(null);
    };

    const handleUpdateRemainder = async event => {
        event.preventDefault();
        try {
            const response = await axios.patch(`https://expensemanager-2t8j.onrender.com/patchremainders/${editRemainderId}`, formData);
            if (response.status === 200) {
                const updatedRemainders = remainders.map(remainder => 
                    remainder._id === editRemainderId ? response.data : remainder
                );
                setRemainders(updatedRemainders);
                alert('Remainder updated successfully');
            } else {
                throw new Error('Failed to update remainder');
            }
        } catch (error) {
            console.error('Error updating remainder:', error);
            alert(error.message || 'Failed to update remainder');
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteRemainder = async id => {
        try {
            const response = await axios.delete(`https://expensemanager-2t8j.onrender.com/deleteremainders/${id}`);
            if (response.status === 200) {
                setRemainders(remainders.filter(remainder => remainder._id !== id));
                alert('Remainder deleted successfully');
            } else {
                throw new Error('Failed to delete remainder');
            }
        } catch (error) {
            console.error('Error deleting remainder:', error);
            alert(error.message || 'Failed to delete remainder');
        }
    };

    return (
        <div className='remainder-body'>
            {!showModal && (
                <>
                    <h1>Remainders</h1>
                    <div>
                        {remainders.filter(remainder => remainder.user === userId).length > 0 ? (
                            <table className='remainder-table'>
                                <tbody>
                                    {remainders
                                        .filter(remainder => remainder.user === userId)
                                        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date ascending
                                        .map(remainder => (
                                            <tr key={remainder._id}>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.title}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{new Date(remainder.date).toLocaleDateString()}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.amount}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.mode}</td>
                                                <td className={remainder.mode === "Credit" ? "credit" : "debit"}>
                                                    <EditIcon className="action-button" onClick={() => handleEditRemainder(remainder._id)} />
                                                    <DeleteIcon className="action-button" onClick={() => handleDeleteRemainder(remainder._id)} />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <p>No remainders</p>
                        )}
                    </div>
                </>
            )}
    
            {showModal && (
                <div className="editRem">
                    <h2 className="form-heading">Edit Reminder</h2>
                    <form onSubmit={handleUpdateRemainder} className="form-container">
                        <div className="input-groupR">
                            <label htmlFor="title" className="form-label">Title:</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-groupR">
                            <label htmlFor="date" className="form-label">Date:</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-groupR">
                            <label htmlFor="amount" className="form-label">Amount:</label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} required className="form-input" />
                        </div>
                        <div className="input-groupR">
                            <label htmlFor="mode" className="form-label">Mode:</label>
                            <select name="mode" value={formData.mode} onChange={handleInputChange} required className="form-input">
                                <option value="">Select Type</option>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                            </select>
                        </div>
                        <button type="submit" className="form-button">Save</button>
                        <button type="button" onClick={handleCloseModal} className="form-button">Close</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Remainders;
