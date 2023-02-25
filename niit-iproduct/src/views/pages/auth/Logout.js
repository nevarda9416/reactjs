import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('userLoggedInfo');
        navigate('/login');
    })
    return (
        <></>
    )
}

export default Logout
