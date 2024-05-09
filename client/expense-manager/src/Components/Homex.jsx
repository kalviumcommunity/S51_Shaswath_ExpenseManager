import React from 'react'
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


function Homex() {
    return (
        <>
            <div className='navBar'>
                <img className='symbol' src={logo}></img>
                <nav>
                    <button className='navbtn'>Home</button>
                    <button className='navbtn'>About</button>
                    <button className='navbtn'>Features</button>
                    <button className='navbtn'>Contact us</button>
                    <button className='navbtn'>Login</button>
                </nav>
            </div>
            <div className='home'>
                <img className='cartoon' src={pic}></img>
                <div className='homechild'>
                    <h1 className='welcome'>Welcome to Expense Vault</h1>
                    <h4 className='welcome'>Take control of your finances with ease</h4>
                </div>
            </div>
            <div className='aboutus'>
                <div className='aboutuschild'>
                    <h2 className='aboutustext'>Expense Vault offers a user-friendly platform for effortless expense tracking. With robust security measures, we ensure your data's safety. We're committed to continual improvement, incorporating user feedback to enhance our platform. Join us on the journey to financial empowerment!</h2>
                </div>
                <img className='aboutuscartoon' src={aboutus}></img>
            </div>
            <div className='features'>
                <div className='featureschild'>
                    <img src={feature1}></img>
                    <h1 className='featurestext'>Track Every Penny</h1>
                    <h3 className='featurestext'>Say goodbye to the hassle of managing receipts and scribbling down expenses on paper. With Expense Vault, you can easily log your expenses on-the-go, right from your smartphone or computer.</h3>
                </div>
                <div className='featureschild'>
                    <img src={feature2}></img>
                    <h1 className='featurestext'>Organize Your Spending</h1>
                    <h3 className='featurestext'>Categorize your expenses with ease and precision. Expense Vault allows you to assign categories to your transactions, helping you understand where your money is going at a glance.</h3>
                </div>
                <div className='featureschild'>
                    <img src={feature3}></img>
                    <h1 className='featurestext'>Gain Valuable Insights</h1>
                    <h3 className='featurestext'>Make informed decisions about your finances with powerful analytics tools. Expense Vault provides detailed reports and visualizations to help you understand your spending patterns over time.</h3>
                </div>
            </div>
            <div className='contactus'>
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
    )
}

export default Homex