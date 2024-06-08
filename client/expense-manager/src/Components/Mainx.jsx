import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts';
import './Mainx.css';
import Overview from './Overview';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Mainx({ userId }) {
    const [data, setData] = useState([]);
    const [remdata, setRemdata] = useState([]);
    const [remindMe, setRemindMe] = useState(false);

    useEffect(() => {
        if (remindMe) {
            console.log('Reminder Alerted !!!!');
            console.log(remindMe);
            toast.info('Reminder is due today');
        }
    }, [remindMe]);

    useEffect(() => {
        handleRemindMe();
    }, [remdata]);

    useEffect(() => {
        fetchTransaction();
        fetchRemainders();
        // Start a timer to check for overdue reminders every minute
        const interval = setInterval(checkForOverdueReminders, 60000); // 1 minute
        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);

    const fetchTransaction = async () => {
        try {
            const res = await fetch(`https://expensemanager-2t8j.onrender.com/get/${userId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            console.log(data);
            setData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchRemainders = async () => {
        try {
            const res = await fetch('https://expensemanager-2t8j.onrender.com/getremainders');
            if (!res.ok) {
                throw new Error('Failed to fetch');
            }
            const remdata = await res.json();
            console.log(remdata);
            setRemdata(remdata);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRemindMe = () => {
        const today = new Date().toISOString().slice(0, 10);
        const userRemainder = remdata.filter(remainder => remainder.user === userId);
        const remindToday = userRemainder.filter(remainder => remainder.date.slice(0, 10) === today);
        if (remindToday.length > 0) {
            setRemindMe(true);
        } else {
            setRemindMe(false);
        }
    };

    const checkForOverdueReminders = () => {
        const now = new Date();
        const overdueReminders = remdata.filter(reminder => {
            const reminderDate = new Date(reminder.date);
            return reminderDate <= now;
        });
        if (overdueReminders.length > 0) {
            // Delete overdue reminders
            deleteOverdueReminders(overdueReminders.map(reminder => reminder._id));
        }
    };

    const deleteOverdueReminders = async (reminderIds) => {
        try {
            await Promise.all(reminderIds.map(async (id) => {
                const res = await fetch(`https://expensemanager-2t8j.onrender.com/delete/${id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) {
                    throw new Error(`Failed to delete reminder with ID: ${id}`);
                }
                console.log(`Reminder with ID ${id} deleted successfully.`);
            }));
            // After deleting, fetch the updated list of reminders
            fetchRemainders();
        } catch (err) {
            console.log(err);
        }
    };

    const xLabels = data.transactions?.map(transaction => {
        const date = new Date(transaction.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }) || [];

    const colorData = data.transactions ? data.transactions.map(transaction => transaction.mode === "Credit" ? '#7fc97f' : '#e15759') : [];

    return (
        <>
            <div className='mainx-body'>
                <ToastContainer />
                <div className='overview-section'><Overview userId={userId} /></div>
                <br />
                <br />
                <div className='mainx-content'>
                    <div className='charts-section'>
                        <BarChart
                            series={[
                                {
                                    data: data.transactions
                                        ? data.transactions.map(
                                            transaction =>
                                                transaction.user === userId ? transaction.amount : null
                                        )
                                        : [],
                                    color: colorData
                                }
                            ]}
                            height={300}
                            width={500}
                            xAxis={[{ data: xLabels, scaleType: 'band' }]}
                        />
                    </div>

                    <div className='recent-section'>
                        <h3 className='recent'>RECENT TRANSACTIONS</h3>
                        <table>
                            <tbody>
                                {data.transactions && data.transactions.slice(-5).map(transaction => (
                                    <tr key={transaction._id}>
                                        <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{new Date(transaction.date).toLocaleDateString()}</td>
                                        <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.title}</td>
                                        <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='remainders-section'>
                        <h3>Reminders</h3>
                        <table>
                            <tbody>
                                {remdata
                                    .filter(remainder => remainder.user === userId)
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .slice(0, 4)
                                    .map(remainder => (
                                        <tr key={remainder._id}>
                                            <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{new Date(remainder.date).toLocaleDateString()}</td>
                                            <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.title}</td>
                                            <td className={remainder.mode === "Credit" ? "credit" : "debit"}>{remainder.amount}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Mainx;
