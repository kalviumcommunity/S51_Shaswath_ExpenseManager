import React, { useState, useEffect } from 'react';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
// import image from '../assets/logo.png'

const YourComponent = ({handleLogin}) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [mode, setMode] = useState('signup'); // Default mode is signup

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
        if (isSignIn) {
            setLoginUsername(e.target.value);
        } else {
            setSignupUsername(e.target.value);
        }
    };

    const handlePasswordChange = (e) => {
        if (isSignIn) {
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
            if (isSignIn) {
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
                    const { token } = response.data;
                    document.cookie = `token=${token}; path=/;`;
                    document.cookie = `id=${response.data.user._id}`;
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

    useEffect(() => {
        setTimeout(() => {
            setIsSignIn(true);
        }, 200);
    }, []);

    const toggle = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div id="container" className={`container ${isSignIn ? 'sign-in' : 'sign-up'}`}>
            {/* FORM SECTION */}
            <div className="row">
                {/* SIGN UP */}
                <div className="col align-items-center flex-col sign-up">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-up">
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input value={signupName} onChange={handleNameChange} type="text" placeholder="Name" />
                            </div>
                            <div className="input-group">
                                <i className="bx bx-mail-send"></i>
                                <input   value={signupUsername} onChange={handleUsernameChange} type="text" placeholder="UserName" />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input value={signupEmail} onChange={handleEmailChange} type="email" placeholder="Email" />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input value={signupPassword} onChange={handlePasswordChange} type="password" placeholder="Password" />
                            </div>
                            {signupError && <p className="error-message">{signupError}</p>}
                            <button onClick={handleSubmit}>Sign up</button>
                            <div id='googlee'></div>
                            <p>
                                <span> Already have an account? </span>
                                <b onClick={toggle} className="pointer"> Sign in here </b>
                            </p>
                        </div>
                    </div>
                </div>
                {/* END SIGN UP */}
                {/* SIGN IN */}
                <div className="col align-items-center flex-col sign-in">
                    <div className="form-wrapper align-items-center">
                        <div className="form sign-in">
                            <div className="input-group">
                                <i className="bx bxs-user"></i>
                                <input type="text" value={loginUsername} onChange={handleUsernameChange} placeholder="Username" />
                            </div>
                            <div className="input-group">
                                <i className="bx bxs-lock-alt"></i>
                                <input value={loginPassword} onChange={handlePasswordChange} type="password" placeholder="Password" />
                            </div>
                            <button onClick={handleSubmit}>Sign in</button>
                            <p>
                                <b> Forgot password? </b>
                            </p>
                            <div id='google'></div>
                            {loginError && <p className="error-message">{loginError}</p>}
                            <p>
                                <span> Don't have an account? </span>
                                <b onClick={toggle} className="pointer"> Sign up here </b>
                            </p>
                        </div>
                    </div>
                    <div className="form-wrapper"></div>
                </div>
                {/* END SIGN IN */}
            </div>
            {/* END FORM SECTION */}
            {/* CONTENT SECTION */}
            <div className="row content-row">
                {/* SIGN IN CONTENT */}
                <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                        <h2>Welcome</h2>
                    </div>
                    <div className="img sign-in"></div>
                </div>
                {/* END SIGN IN CONTENT */}
                {/* SIGN UP CONTENT */}
                <div className="col align-items-center flex-col">
                    <div className="img sign-up"></div>
                    <div className="text sign-up">
                        <h2>Join with us</h2>
                    </div>
                </div>
                {/* END SIGN UP CONTENT */}
            </div>
            {/* END CONTENT SECTION */}
        </div>
    );
};

export default YourComponent;
