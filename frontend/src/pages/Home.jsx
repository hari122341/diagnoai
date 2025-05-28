import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Transform from '../components/Transform'
import Works from '../components/Works'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import Login from '../components/Login'
const Home = () => {
    return (
        <>
            {/* {/* <Navbar /> */}
            <Hero />
            <Transform />
            <Works />
            <Faq />
            {/* <Footer /> */}
            {/* <Login /> */}

        </>
    )
}

export default Home