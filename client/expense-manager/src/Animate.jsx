



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import './AuthForm.css'; // Import the CSS file

function Auth({ handleLogin }) {
    const [mode, setMode] = useState('login'); // Default mode is login

    // State variables for login
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // State variables for signup
    const [signupName, setSignupName] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupError, setSignupError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "358374114106-pe56que7nt4q3n1o7up00nhgbrdpcnv5.apps.googleusercontent.com",
            callback: handleCallBackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("google"),
            { theme: "outline", size: "large" }
        )
        google.accounts.id.renderButton(
            document.getElementById("googlee"),
            { theme: "outline", size: "large" }
        )
    }, []);

    const handleUsernameChange = (e) => {
        if (mode === 'login') {
            setLoginUsername(e.target.value);
        } else {
            setSignupUsername(e.target.value);
        }
    };

    const handlePasswordChange = (e) => {
        if (mode === 'login') {
            setLoginPassword(e.target.value);
        } else {
            setSignupPassword(e.target.value);
        }
    };

    const handleNameChange = (e) => {
        setSignupName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setSignupEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'login') {
                const response = await axios.post('https://expensemanager-2t8j.onrender.com/login', {
                    username: loginUsername,
                    password: loginPassword
                });
                if (response.status === 200) {
                    const { token } = response.data;
                    document.cookie = `token=${token}; path=/;`;
                    document.cookie = `id=${response.data.user._id}`;
                    handleLogin();
                    navigate('/');
                } else {
                    const errorData = response.data;
                    setLoginError(errorData.error);
                }
            } else {
                const response = await axios.post('https://expensemanager-2t8j.onrender.com/signup', {
                    name: signupName,
                    username: signupUsername,
                    email: signupEmail,
                    password: signupPassword
                });
                if (response.status === 200) {
                    alert('Signup successful! Please login.');
                    handleLogin();
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (mode === 'login') {
                setLoginError('Something went wrong. Please try again later.');
            } else {
                setSignupError('Something went wrong. Please try again later.');
            }
        }
    };

    function handleCallBackResponse(response) {
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
        <div className={`cont ${mode === 'signup' ? 's--signup' : ''}`}>
            <div className="form sign-in">
                <h2 className='headingl'>Login</h2>
                <label className='labell' htmlFor="username">
                    <input className='inputl' type="text" id="username" value={loginUsername} onChange={handleUsernameChange} placeholder="Username" />
                    <span>Username</span>
                </label>
                <label className='labell' htmlFor="password">
                    <input className='inputl' type="password" id="password" value={loginPassword} onChange={handlePasswordChange} placeholder="Password" />
                    <span>Password</span>
                </label>
                {loginError && <p className="error-message">{loginError}</p>}
                <button className='buttonl' type="submit" onClick={handleSubmit}>Login</button>
                <p>If you are a new user, please <button className='buttonll' onClick={() => setMode('signup')}>Sign Up</button></p>
                <div id='google'></div>
            </div>
            <div className="sub-cont">
                <div className="img">
                    {/* Your existing image content */}
                </div>
                <div className="form sign-up">
                    <h2 className='headingl'>Sign Up</h2>
                    <label className='labell' htmlFor="name">
                        <input className='inputl' type="text" id="name" value={signupName} onChange={handleNameChange} placeholder="Name" />
                        <span>Name</span>
                    </label>
                    <label className='labell' htmlFor="username">
                        <input className='inputl' type="text" id="username" value={signupUsername} onChange={handleUsernameChange} placeholder="Username" />
                        <span>Username</span>
                    </label>
                    <label className='labell' htmlFor="email">
                        <input className='inputl' type="email" id="email" value={signupEmail} onChange={handleEmailChange} placeholder="Email" />
                        <span>Email</span>
                    </label>
                    <label className='labell' htmlFor="password">
                        <input className='inputl' type="password" id="password" value={signupPassword} onChange={handlePasswordChange} placeholder="Password" />
                        <span>Password</span>
                    </label>
                    {signupError && <p className="error-message">{signupError}</p>}
                    <button className='buttonl'  type="submit" onClick={handleSubmit}>Sign Up</button>
                    <p>If you have an account, please <button className='buttonll' onClick={() => setMode('login')}>Login</button></p>
                    <p>OR</p>
                    <div id='googlee'></div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
