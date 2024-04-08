import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

function Login({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        google.accounts.id.initialize({
            client_id: "358374114106-pe56que7nt4q3n1o7up00nhgbrdpcnv5.apps.googleusercontent.com",
            callback: handleCallBackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("google"),
            {theme: "outline", size: "large"}
        )
    },[])

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
                handleLogin(); 
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

    function handleCallBackResponse(response){
        console.log("encoded", response.credential)
        const userObj = jwt_decode(response.credential)
        console.log(userObj)
        
        // Send userObj to backend along with JWT token
        sendUserDataToBackend(userObj);
    }
    
    async function sendUserDataToBackend(userData) {
        try {
            const response = await axios.post('https://expensemanager-2t8j.onrender.com/gusers', userData);
            console.log('User data sent to backend:', response.data);
    
            // Save JWT token locally
            const { token, user } = response.data;
            document.cookie = `token=${token}; path=/;`;
            document.cookie = `id=${user._id}`;
            // Perform any additional actions after successful login
            handleLogin();
            navigate('/');
        } catch (error) {
            console.error('Error sending user data to backend:', error);
            // Handle error
        }
    }
    

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

                <div id='google'></div>

            </form>
        </div>
    );
}

export default Login;