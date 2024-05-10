import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import './Homex.css'
import logo from '../assets/symbolx.png'
import pic from '../assets/logox.png'
import aboutus from '../assets/aboutus.png'
import feature1 from '../assets/feature1.png'
import feature2 from '../assets/feature2.png'
import feature3 from '../assets/feature3.png'
import contact from '../assets/contact.png'

import { FacebookOutlined } from '@mui/icons-material';
import { Twitter } from '@mui/icons-material';
import { Instagram } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



function Homex({ isLoggedIn, handleLogout, remindMe, userId }) {
    useEffect(() => {
        if (remindMe) {
            console.log('Reminder Alerted !!!!');
            console.log(remindMe)
            toast.info('Reminder is due today');
        }
    }, [remindMe]);

    useEffect(() => {
        document.body.classList.add('bodyh');
        return () => {
            document.body.classList.remove('bodyh');
        };
    }, []);

    const aboutScrollRef = useRef(null)
    const featureScrollRef = useRef(null)
    const contactScrollRef = useRef(null)

    const aboutButtonClick = () => {
        if (aboutScrollRef.current) {
            aboutScrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const featureHandleClick = () => {
        if (featureScrollRef.current) {
            featureScrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const contactHandleClick = () => {
        if (contactScrollRef.current) {
            contactScrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            {!isLoggedIn ? (
                <>
                    <div className='navBar'>
                        <img className='symbol' src={logo}></img>
                        <nav>
                            <Link to='/'><button className='navbtn'>Home</button></Link>
                            <button className='navbtn' onClick={aboutButtonClick}>About</button>
                            <button className='navbtn' onClick={featureHandleClick}>Features</button>
                            <button className='navbtn' onClick={contactHandleClick}>Contact us</button>
                            <Link to='/signup'><button className='navbtn'>Login</button></Link>
                        </nav>
                    </div>
                    <div className='home'>
                        <img className='cartoon' src={pic}></img>
                        <div className='homechild'>
                            <h1 className='welcome'>Welcome to Expense Vault</h1>
                            <p className='welcome'>Take control of your finances with ease</p>
                        </div>
                    </div>
                    <div className='aboutus' ref={aboutScrollRef}>
                        <div className='aboutuschild'>
                            <p className='aboutustext'>Expense Vault offers a user-friendly platform for effortless expense tracking. With robust security measures, we ensure your data's safety. We're committed to continual improvement, incorporating user feedback to enhance our platform. Join us on the journey to financial empowerment!</p>
                        </div>
                        <img className='aboutuscartoon' src={aboutus}></img>
                    </div>
                    <div className='features' ref={featureScrollRef}>
                        <div className='featureschild'>
                            <img className='featurescartoon' src={feature1}></img>
                            <br />

                            <h1 className='featurestext'>Track Every Penny</h1>
                            <br />
                            <br />

                            <p className='featurestextp'>Say goodbye to the hassle of managing receipts and scribbling down expenses on paper. With Expense Vault, you can easily log your expenses on-the-go, right from your smartphone or computer.</p>
                        </div>
                        <div className='featureschild'>
                            <img className='featurescartoon' src={feature2}></img>
                            <h1 className='featurestext'>Organize Your Spending</h1>
                            <br />
                            <p className='featurestextp'>Categorize your expenses with ease and precision. Expense Vault allows you to assign categories to your transactions, helping you understand where your money is going at a glance.</p>
                        </div>
                        <div className='featureschild'>
                            <img className='featurescartoon' src={feature3}></img>

                            <h1 className='featurestext'>Gain Valuable Insights</h1>
                            <br />

                            <p className='featurestextp'>Make informed decisions about your finances with powerful analytics tools. Expense Vault provides detailed reports and visualizations to help you understand your spending patterns over time.</p>
                        </div>
                    </div>
                    <div className='contactus' ref={contactScrollRef}>
                        <img className='contactuscartoon' src={contact}></img>
                        <div className='contactuschild'>
                            <h2 className='contacttext'>Customer Support: Our dedicated support team is available to help you with any inquiries or technical assistance you may need. Contact us via email at support@expensevault.com</h2>
                            <br />
                            <br />
                            <h2 className='contacttext'>General Inquiries: For general inquiries or business-related questions, please email us at info@expensevault.com.</h2>
                            <br />
                            <br />
                            <h2 className='contacttext'>Feedback and Suggestions: Your feedback is invaluable to us as we continuously strive to improve our platform. Share your suggestions, feature requests, or comments with us at feedback@expensevault.com.</h2>
                        </div>
                    </div>
                    <div className='footer'>
                        <div className='footerchild'>
                            <h4 className='contactustext'>&copy; 2024 Expense Vault. All rights reserved.</h4>
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
                                <h4 className='contactustext'>For Contact : expensevault@gmail.com</h4>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='dash'>
                    <nav className='navdash'>
                        <Link to='/form'><button className='navbtn'>Add Transaction</button></Link>
                        <Link to='/rem'><button className='navbtn'>Remainders</button></Link>
                        <Link to={`/overview/${userId}`}><button className='navbtn'>Overview</button></Link>
                        {/* <button className='navbtn'>Contact us</button> */}
                        <button onClick={handleLogout} className='navbtn'>Logout</button>
                        <ToastContainer />
                    </nav>
                    <div className='second'>
                        Content
                    </div>
                </div>
            )}
        </>
    )
}

export default Homex