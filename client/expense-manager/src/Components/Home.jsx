import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image from '../assets/logo.png';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = () => {
        const token = getCookie('token');
        setIsLoggedIn(!!token);
    };

    const handleLogout = () => {
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setIsLoggedIn(false);
        window.location.reload();
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    return (
        <div>
            <div className='authentication'>
                <img alt='image' src={image}></img>
                <div className='child'>
                    {isLoggedIn ? (
                        <button className="logout" onClick={handleLogout}>LOGOUT</button>
                    ) : (
                        <>
                            <Link to='/login'><button className="login">LOGIN</button></Link>
                            <Link to='/signup'><button className="signup">SIGNUP</button></Link>
                        </>
                    )}
                </div>
            </div>
            {!isLoggedIn && (
                <>
                    <h1>EXPENSE VAULT</h1>
                    <h3>Navigate your finances easily !</h3>
                    <p>Expense Manager is a web application designed to help users track their expenses efficiently. It provides a user-friendly interface to add, categorize, and analyze expenses, aiding in budget management and financial planning.</p>
                </>
            )}
        </div>
    );
}

export default Home;
