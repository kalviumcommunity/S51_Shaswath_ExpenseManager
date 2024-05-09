import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image from '../assets/logo.png';
import Main from './Main';
import { FacebookOutlined } from '@mui/icons-material';
import { Twitter } from '@mui/icons-material';
import { Instagram } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home({ isLoggedIn, handleLogout, remindMe }) {
    useEffect(() => {
        if (remindMe) {
            console.log('Reminder Alerted !!!!');
            console.log(remindMe)
            toast.info('Reminder is due today');
        }
    }, [remindMe]);
    return (
        <div>
        {/* <div className='curve'><div className='curves'></div></div> */}
            <div className='authentication'>
                <img alt='image' src={image}></img>
                <div className='child'>
                    {isLoggedIn ? (
                        <div className='innerChild'>
                            <button className="logout" onClick={handleLogout}>LOGOUT</button> <br />
                            <Link to='/rem'><button className='logout'>REMAINDER</button></Link>
                            <ToastContainer />
                        </div>
                    ) : (
                        <>
                            {/* <Link to='/login'><button className="login">LOGIN</button></Link> */}
                            <Link to='/signup'><button className="signup">SIGNUP</button></Link>
                        </>
                    )}
                </div>
            </div>
            {!isLoggedIn && (
                <div className='content'>
                    <header className="header">
                        <h1>Welcome to Expense Vault</h1>
                        <p>Take control of your finances with ease</p>
                    </header>
                    <section className="features">
                        <div className="feature">
                            <h2>Track Every Penny</h2>
                            <p>Say goodbye to the hassle of managing receipts and scribbling down expenses on paper. With Expense Vault, you can easily log your expenses on-the-go, right from your smartphone or computer.</p>
                        </div>
                        <div className="feature">
                            <h2>Organize Your Spending</h2>
                            <p>Categorize your expenses with ease and precision. Expense Vault allows you to assign categories to your transactions, helping you understand where your money is going at a glance.</p>
                        </div>
                        <div className="feature">
                            <h2>Gain Valuable Insights</h2>
                            <p>Make informed decisions about your finances with powerful analytics tools. Expense Vault provides detailed reports and visualizations to help you understand your spending patterns over time.</p>
                        </div>
                    </section>

                    <section className="get-started">
                        <h2>Get Started Today</h2>
                        <p>Ready to take control of your finances? Sign up for Expense Vault today and start your journey towards financial freedom.</p>
                        <Link to='/signup'><button className="signupnow">SIGNUP NOW</button></Link>
                    </section>

                    <footer className="footer">
                        <div className="footer-content">
                            <p>&copy; 2024 Expense Vault. All rights reserved.</p>
                            <div className="social-links">
                                <a href="https://www.facebook.com/expensevault" target="_blank" rel="noopener noreferrer">
                                    <FacebookOutlined />
                                </a>
                                <a href="https://twitter.com/expensevault" target="_blank" rel="noopener noreferrer">
                                    <Twitter />

                                </a>
                                <a href="https://www.instagram.com/expensevault" target="_blank" rel="noopener noreferrer">
                                    <Instagram />
                                </a>
                                <p>For Contact : expensevault@gmail.com</p>
                            </div>
                        </div>
                    </footer>

                </div>
            )}
            {isLoggedIn && (
                <>
                    <Main />
                </>
            )}
        </div>
    );
}

export default Home;
