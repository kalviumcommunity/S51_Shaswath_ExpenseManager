import React, { useEffect, useState } from 'react';

export default function Image({ userId }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchTransaction();
    }, []);

    const fetchTransaction = async () => {
        try {
            const res = await fetch("https://expensemanager-2t8j.onrender.com/get");
            const data = await res.json();
            setData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const imageStyle = {
        width: '400px',
        height: '400px',
        margin: '10px',
        borderRadius: '5px',
        cursor: 'pointer'
    };
    const heading = {
        color: 'rgb(51, 186, 240)'
    }


    return (
        <div style={{ padding: '20px' }}>
            <h2 style={heading}>Images</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {data.map((image) => (
                    userId === image.user ? (
                        <img
                            key={image.imageUrl}
                            src={image.imageUrl}
                            alt="Image"
                            style={imageStyle}
                        />
                    ) : null
                ))}
            </div>
        </div>
    );
}
