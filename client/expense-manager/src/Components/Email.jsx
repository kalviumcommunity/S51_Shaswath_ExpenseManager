import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


function Email() {
    

    useEffect(() => {
        verifyEmail()
    }, [])

    const verifyEmail = async () => {
        try {
            // const url = "http://localhost:7777/verification"
            const url = "https://expensemanager-2t8j.onrender.com/verification"
            const { data } = await axios.get(url)
            console.log(data)

        } catch (err) { // Fix the syntax error here
            console.log(err)
        }
    }
    

    return (
        <>
            <h1>Email verified </h1>
            <Link to='/'><button>Click to continue</button></Link>
        </>
    )
}

export default Email