import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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



    return (
        <>
            <div>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <label htmlFor="name" >
                        <input type="text"  id="name" value={name} onChange={handleNameChange} required placeholder="Name" />
                        <span>Name</span>
                    </label>
                    <label htmlFor="username" >
                        <input type="text"  id="username" value={username} onChange={handleUsernameChange} placeholder="Username" required />
                        <span>Username</span>
                    </label>

                    <label htmlFor="email" >
                        <input type="email"  id="email" value={email} onChange={handleEmailChange} required placeholder="Email" />
                        <span>Email</span>
                    </label>

                    <label htmlFor="password" >
                        <input type="password"  id="password" value={password} onChange={handlePasswordChange} required placeholder="Password" />
                        <span>Password</span>
                    </label>

                    <button className="button-submit" id='button' type="submit">Sign Up</button>
                </form>
            </div>
        </>
    );
}

export default Signup;
