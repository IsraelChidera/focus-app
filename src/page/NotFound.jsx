import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    return (
        <section className='h-screen flex items-center justify-center'>
            <div className='text-white text-center '>
                <p className='text-2xl font-bold pb-2'> Page Not Found </p>
                <p>
                    <NavLink className="underline-offset-4 underline" to="/">
                        Return to Login
                    </NavLink>
                </p>
            </div>
        </section>
    )
}

export default NotFound