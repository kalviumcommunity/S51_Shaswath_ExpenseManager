import React, { useState, useEffect } from 'react';
import { BarChart, ChartsXAxis } from '@mui/x-charts';
import './Mainx.css'
import Overview from './Overview'

function Mainx({ userId }) {
    const [data, setData] = useState([]);
    const [remdata, setRemdata] = useState([])

    useEffect(() => {
        fetchTransaction();
        fetchRemainders();
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
            const res = await fetch('https://expensemanager-2t8j.onrender.com/getremainders')
            if (!res.ok) {
                throw new Error('Failed to fetch')
            }
            const remdata = await res.json()
            console.log(remdata)
            setRemdata(remdata)
        } catch (err) {
            console.log(err)
        }
    }

    const xLabels = data.transactions?.map(transaction => {
        const date = new Date(transaction.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }) || [];

    const colorData = data.transactions ? data.transactions.map(transaction => transaction.mode === "Credit" ? '#7fc97f' : '#e15759') : [];


    return (
        <>
        
        <div className='mainx-body'>
            <div className='overview-section'><Overview userId={userId}/></div>
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
            
            <div>

            </div>

            <div className='remainders-section'>
                <h3>Remainders</h3>
                <table>
                    <tbody>
                        {remdata.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5).map(remainder => (
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
