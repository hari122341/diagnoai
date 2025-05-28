import React from 'react'

const Faq = () => {
    return (
        <div>
            <h1 className='text-center text-3xl text-green-500 font-bold mb-3 mt-3'>FAQ</h1>
            <div className='flex flex-col justify-center items-center my-3'>
                {/* <h1>hu</h1> */}
                <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border w-140">
                    <div className="collapse-title font-semibold text-xl">How does the system analyze diseases?</div>
                    <div className="collapse-content text-sm text-gray-600 ">
                        Click the "Sign Up" button in the top right corner and follow the registration process.
                    </div>
                </div>
                <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border w-140">
                    <div className="collapse-title font-semibold text-xl">Do I need to upload medical reports?</div>
                    <div className="collapse-content text-sm text-gray-600 ">
                        Yes, uploading reports like blood tests or X-rays helps the AI give more accurate results using OCR and ML models.
                    </div>
                </div>
                <div tabIndex={0} className="collapse collapse-arrow bg-base-100 border-base-300 border w-140">
                    <div className="collapse-title font-semibold text-xl">Is my data safe and private?</div>
                    <div className="collapse-content text-sm text-gray-600 pd-5">
                        Absolutely. All data is encrypted and processed securely to maintain privacy and confidentiality.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faq