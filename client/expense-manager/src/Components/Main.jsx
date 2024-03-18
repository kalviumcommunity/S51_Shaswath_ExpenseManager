import React, { useState } from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PieChartIcon from '@mui/icons-material/PieChart';
import TransactionForm from './TransactionForm'; // Assuming TransactionForm component is in the same directory

export default function Main() {
    const [showForm, setShowForm] = useState(false);

    const handleAddNewTransaction = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <>
            <div className='mainn'>
            <button className='login' onClick={handleAddNewTransaction}>Add New Transaction</button>
            <div className='iconDiv'>
                <FormatListBulletedIcon fontSize='large' className='icon'/>
                <PieChartIcon fontSize='large' className='icon' />
            </div>
            </div>
            {showForm && <TransactionForm onClose={handleCloseForm} />}
        </>
    );
}
