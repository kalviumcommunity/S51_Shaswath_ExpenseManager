import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts';
import './Mainx.css';
import Overview from './Overview';
import moment from 'moment';


import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Mainx({ userId }) {
    const [data, setData] = useState([]);
    const [remdata, setRemdata] = useState([]);
    const [remindMe, setRemindMe] = useState(false);
    const [highlightedItem, setHighLightedItem] = useState(null);

    const today = moment().startOf('day')


    useEffect(() => {
        fetchTransaction();
        fetchRemainders();
    }, []);

    useEffect(() => {
        handleRemindMe();
    }, [remdata]);

    useEffect(() => {
        if (remindMe) {
            console.log('Reminder Alerted !!!!');
            console.log(remindMe);
            toast.info('Reminder is due today');
        }
    }, [remindMe]);

    const fetchTransaction = async () => {
        try {
            const res = await fetch(`https://expensemanager-2t8j.onrender.com/get/${userId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            console.log("recent transactions", data);
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

    const deleteOverdueReminder = async (id) => {
        try {
            const response = await fetch(`https://expensemanager-2t8j.onrender.com/deleteremainders/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete overdue reminder');
            }
            console.log(`Overdue reminder with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting overdue reminder with ID ${id}:`, error);
            throw error;
        }
    };

    const expiredReminders = remdata.filter(reminder => {
        const reminderDate = moment(reminder.date, "YYYY-MM-DD").startOf('day');
        return reminderDate.isBefore(today);
    });

    console.log("expiredReminders", expiredReminders);

    if (expiredReminders.length > 0) {
        expiredReminders.forEach(reminder => {
            deleteOverdueReminder(reminder._id);
        });
    }



    const xLabels = data.transactions?.map(transaction => {
        const date = new Date(transaction.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }) || [];

    const colorData = data.transactions ? data.transactions.map(transaction => transaction.mode === "Credit" ?  '#e15759' : '#7fc97f') : [];

    const categoryData = data.transactions?.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
    }, {});

    const pieChartData = categoryData ? Object.entries(categoryData).map(([category, amount], index) => ({
        id: index,
        value: amount,
        label: category
    })) : [];

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
                                    color: colorData,
                                }
                            ]}
                            height={300}
                            width={500}
                            xAxis={[{ data: xLabels, scaleType: 'band' }]}
                        />
                    </div>

                    <div className='recent-section'>
                        <h3 className='recent'>RECENT TRANSACTIONS</h3>
                        {data.transactions && data.transactions.length > 0 ? (
                            <table className='mainx-table'>
                                <tbody>
                                    {data.transactions.slice(-5).map(transaction => (
                                        <tr key={transaction._id}>
                                            <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{new Date(transaction.date).toLocaleDateString()}</td>
                                            <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.title}</td>
                                            <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <>
                                <br />
                                <br />
                                <br />

                                <h4>No reminders available. Please add your reminders to see them here.</h4>

                            </>
                        )}
                    </div>


                    <div className="pie-chart-container">
                        <PieChart
                            series={
                                [{
                                    data: pieChartData,
                                    innerRadius: 100,
                                    outerRadius: 50,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    startAngle: 0,
                                    endAngle: 360,
                                    cx: 100,
                                    cy: 95,
                                    highlightScope: { highlighted: 'item', faded: 'global' },
                                }]}
                            highlightedItem={highlightedItem}
                            onHighlightChange={setHighLightedItem}
                            width={400}
                            height={200}
                            slotProps={{
                                legend: {
                                    hidden: "True"
                                }
                            }}
                        />
                    </div>

                    <div className='remainders-section'>
                        <h3>RECENT REMINDERS</h3>
                        {remdata && remdata.filter(remainder => remainder.user === userId).length > 0 ? (
                            <table className='mainx-tabler'>
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
                        ) : (
                            <>
                                <br />
                                <br />
                                <br />

                                <h4>No reminders available. Please add your reminders to see them here.</h4>

                            </>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default Mainx;
