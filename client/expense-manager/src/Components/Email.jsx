import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function Email() {
    const [valid, setValid] = useState(true)
    const param = useParams()

    useEffect(() => {
        verifyEmail()
    }, [param])

    const verifyEmail = async () => {
        try {
            // const url = `http://localhost:7777/verification`
            const url = `https://expensemanager-2t8j.onrender.com/verification`

            const { data } = await axios.get(url)
            console.log(data)
            setValid(true)


        } catch { err } {
            console.log(err)
            setValid(false)
        }
    }

    return (
        <>
            {valid ? (
                <>
                    <h1>Check Email and Verify it</h1>
                </>
            ) : (
                <h1>404 NOT FOUND</h1>
            )}
        </>
    )
}

export default Email