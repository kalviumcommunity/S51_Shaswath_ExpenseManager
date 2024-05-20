import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts';
import './Mainx.css'

function Mainx({ userId }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchTransaction();
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

    return (
        <div className='mainx-body'>
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
                            color: 'red'
                        }
                    ]}
                    height={290}
                    width={200}
                    xaxis={[
                        {
                            data: data.transactions
                                ? data.transactions.map(
                                    transaction =>
                                        transaction.user === userId && transaction.date
                                            ? new Date(transaction.date).toLocaleDateString()
                                            : ''
                                )
                                : [],
                            scaleType: 'band',
                        }
                    ]}
                    // margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
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
                                <td className={transaction.mode === "Credit" ? "credit" : "debit"}>{transaction.mode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default Mainx;
