import React from 'react'

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
            <nav>
                <h6 className="footer-title">DIAGNOAI</h6>
                {/* <a className="link link-hover">Branding</a>
                <a className="link link-hover">Design</a>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a> */}
                <p className='text-md'>Your trusted health partner. <br />
                    Delivering quality care, one click at a time.
                </p>
            </nav>
            <nav>
                <h6 className="footer-title">Quick Links</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Services</a>
                <a className="link link-hover">Book Appointment</a>
                <a className="link link-hover">Contact</a>
            </nav>
            <nav>
                <h6 className="footer-title">Contact</h6>
                <a className="link link-hover">Address: 123 Health St, Wellness City</a>
                <a className="link link-hover">Phone: +91 9000000000</a>
                <a className="link link-hover">Email: diagnoai@gmail.com</a>
            </nav>
        </footer>
    )
}

export default Footer