import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://expensemanager-2t8j.onrender.com/login', {
                username,
                password
            });
            if (response.status === 200) {
                const { token } = response.data;
                document.cookie = `token=${token}; path=/;`;
                document.cookie = `id=${response.data.user._id}`;
                navigate('/');
            } else {
                const errorData = response.data;
                setError(errorData.error);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
            <h1>LOGIN</h1>
                <label htmlFor="username">
                    <input type="text" id="username" value={username} onChange={handleUsernameChange} placeholder="Username" />
                    <span>Username</span>
                </label>
                <label htmlFor="password">
                    <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                    <span>Password</span>
                </label>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" id='button'>Login</button>
                <p>If you are a new user, please <Link to="/signup" id="new">SIGN UP</Link></p>
            </form>
            
        </div>
    );
}

export default Login;
