import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <div className="navbar bg-green-600 shadow-sm fixed z-5">
            <div className="navbar-start">

                <Link to="/" className="btn btn-ghost text-xl text-white">DIAGNOAI</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link to="/" className='text-white'>Home</Link>
                    </li>
                    <li>
                        <Link to="/" className='text-white'>About</Link>
                    </li>
                    <li>
                        <Link to='/' className='text-white'>Contact Us</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link to='/signin' className="btn">Sign-in</Link>
            </div>

        </div>
    )
}

export default Navbar