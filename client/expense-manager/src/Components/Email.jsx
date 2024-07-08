import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Verification = () => {
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            handleVerification(token);
        }
    }, [location.search]);

    const handleVerification = async (token) => {
        try {
            const response = await fetch(`https://expensevault.pages.dev/verification?token=${token}`);
            const data = await response.json();

            if (data.token) {
                // Store the JWT token
                localStorage.setItem('token', data.token);
                setVerified(true);
                setMessage('Email verified successfully. You can continue to the application.');
                // Automatically redirect after a delay
                setTimeout(() => {
                    navigate('/');
                }, 3000); // 3-second delay
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("Verification failed:", error);
            setMessage('Verification failed. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
            {verified && (
                <button onClick={() => navigate('/')}>Continue</button>
            )}
        </div>
    );
};

export default Verification;
