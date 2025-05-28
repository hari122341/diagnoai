import React from 'react'
import hero1 from '../assets/hero1.jpg'
const Hero = () => {
    return (
        <div className="hero bg-base-200 min-h-150">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src={hero1}
                    className="max-w-lg rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl font-bold text-green-500">Welcome to AI-Powered Disease Analysis Systems</h1>
                    <p className="py-6 text-xl">
                        Your health companion for fast, intelligent diagnostics and care recommendations.
                    </p>
                    <button class="btn btn-success text-white p-5 text-xl">Success</button>
                </div>
            </div>
        </div>
    )
}

export default Hero