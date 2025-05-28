import React from 'react'
import img2 from '../assets/img2.jpg'
const Works = () => {
    return (
        <>

            <div className="hero bg-base-200 min-h-150">

                <div className="hero-content flex-col lg:flex-row justify-center">
                    <img
                        src={img2}
                        className="max-w-lg rounded-lg shadow-2xl mr-15"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">How it Works</h1>
                        <ol type='⬤'>
                            <li>
                                <div className='flex items-center'>
                                    <div className='flex w-4 h-4 bg-black rounded-2xl items-center mt-3 mr-2'>

                                    </div>
                                    <h2 className='pt-3 font-semibold'>Symptom & Report Input</h2>
                                </div>
                                <p className="py-1 text-gray-600">
                                    Users can either enter symptoms manually or upload medical reports (like blood tests, X-rays, prescriptions, etc.).
                                </p>
                            </li>
                            <li>
                                <div className='flex items-center'>
                                    <div className='flex w-4 h-4 bg-black rounded-2xl items-center mt-3 mr-2'>

                                    </div>
                                    <h2 className='pt-3 font-semibold'>
                                        OCR & Data Extraction</h2>
                                </div>
                                <p className="py-1 text-gray-600">
                                    If a user uploads a report, OCR (Optical Character Recognition) scans it and extracts the relevant medical terms and values automatically.
                                </p>
                            </li>
                            <li>
                                <div className='flex items-center'>
                                    <div className='flex w-4 h-4 bg-black rounded-2xl items-center mt-3 mr-2'>

                                    </div>
                                    <h2 className='pt-3 font-semibold'>Disease Prediction using AI</h2>
                                </div>
                                <p className="py-1 text-gray-600">
                                    The extracted data or symptoms are sent to a Machine Learning model trained on medical datasets. It predicts possible diseases or health conditions.
                                </p>
                            </li>
                            <li>
                                <div className='flex items-center'>
                                    <div className='flex w-4 h-4 bg-black rounded-2xl items-center mt-3 mr-2'>

                                    </div>
                                    <h2 className='pt-3 font-semibold'>
                                        Dashboard & History</h2>
                                </div>
                                <p className="py-1 text-gray-600">
                                    Users can view previous analysis results and track their health reports over time.
                                </p>
                            </li>
                            <li>
                                <div className='flex items-center'>
                                    <div className='flex w-4 h-4 bg-black rounded-2xl items-center mt-3 mr-2'>

                                    </div>
                                    <h2 className='pt-3 font-semibold'>
                                        Suggestion & Recommendation System</h2>
                                </div>
                                <p className="py-1 text-gray-600">
                                    Based on the diagnosis, the system provides basic advice or suggestions like lifestyle changes, urgency level, and when to see a doctor.
                                </p>
                            </li>
                        </ol>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Works