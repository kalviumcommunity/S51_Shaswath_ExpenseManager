import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'


function Email({handleLoginL}) {
    document.body.classList.add('bodyh');
    const navigate = useNavigate()


    useEffect(() => {
        verifyEmail()
    }, [])

    const verifyEmail = async () => {
        try {
            // const url = "http://localhost:7777/verification"
            const url = "https://expensemanager-2t8j.onrender.com/verification"
            const { data } = await axios.get(url)
            const { token, user } = data;
            console.log(data)
            localStorage.setItem('token', token);
            handleLoginL()

            // navigate('/')

        } catch (err) { // Fix the syntax error here
            console.log(err)
        }
    }
    

    return (
        <div className='parent-container'>
        <div>
            <h1>Email verified </h1>
            <Link to='/'><button className='form-button'>Click to continue</button></Link>
        </div>
        </div>
    )
}

export default Email