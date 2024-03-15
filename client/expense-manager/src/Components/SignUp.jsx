import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; 

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const spans = []
    const Navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://expensemanager-2t8j.onrender.com/signup', {
                name,
                username,
                email,
                password
            });
            if (response.status === 200) {
                alert('Signup successful! Please login.');
                Navigate('/login');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Something went wrong. Please try again later.');
        }
    };
    for (let i = 0; i < 15; i++) {
        const randomNumber = getRandomNumber(15, 50); 
        spans.push(<span key={i} style={{ '--i': randomNumber }}></span>);
    }


    return (
        <>
        <div className='bubbles'>
            {spans}
        </div>
        <div className='bubble'>
            {spans}
        </div>
        <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className='label'>Name:</label>
                    <input type="text" className='inputText'  id="name" value={name} onChange={handleNameChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="username" className='label'>Username:</label>
                    <input type="text" className='inputText' id="username" value={username} onChange={handleUsernameChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className='label'>Email:</label>
                    <input type="email" className='inputText' id="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className='label'>Password:</label>
                    <input type="password" className='inputText' id="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <button className="button-submit" type="submit">Sign Up</button>
            </form>
        </div>
        </>
    );
}

export default Signup;
