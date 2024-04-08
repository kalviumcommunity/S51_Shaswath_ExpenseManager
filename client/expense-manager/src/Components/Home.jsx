import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image from '../assets/logo.png';
import Main from './Main';

function Home({ isLoggedIn, handleLogout }) {

    

    return (
        <div>
            <div className='authentication'>
                <img alt='image' src={image}></img>
                <div className='child'>
                    {isLoggedIn ? (
                        <>
                        <button className="logout" onClick={handleLogout}>LOGOUT</button> <br/>
                        </>
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
            {isLoggedIn && (
                <>
                    <Main/>
                </>
            )}
        </div>
    );
}

export default Home;
