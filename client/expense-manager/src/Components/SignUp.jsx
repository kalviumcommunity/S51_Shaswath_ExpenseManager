import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';




function Signup({handleLogin}) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const Navigate = useNavigate();

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
                handleLogin()
                Navigate('/');
            }
        } catch (error) {
            console.error('Error signing up:', error);
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
            Navigate('/');
        } catch (error) {
            console.error('Error sending user data to backend:', error);
            // Handle error
        }
    }
    



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
                    <div id='google'></div>
                </form>
            </div>
        </>
    );
}

export default Signup;
