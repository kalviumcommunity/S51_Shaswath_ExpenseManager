import React from 'react'
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(()=>{
        checkLoginStatus()
    }, [])
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
        <>
            <h1>Expense Manager</h1>
            {isLoggedIn ? (
                    <button className="logout" onClick={handleLogout}>LOGOUT</button>
                ) : (
                    <>
                    <Link to='/login'><button className="button">LOGIN</button></Link>
                    <Link to='/signup'><button className="button">SIGNUP</button></Link>
                    </>
            )}
        </>
    )
}
export default Home
