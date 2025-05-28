import React, { useState, useEffect } from 'react'

const Ai = ({ message }) => {
    console.log(message);



    return (
        <div className="p-4 space-y-4">

            <div>
                <h2 className="text-2xl font-semibold mb-4">Disease</h2>
                <p className="text-gray-700">{message.text.disease}</p>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Causes</h2>
                <ul className="list-disc pl-5">
                    {message.text.causes.map((cause, index) => (
                        <li key={index} className="text-gray-700">{cause}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Prevention</h2>
                <ul className="list-disc pl-5">
                    {message.text.prevention?.map((prevention, index) => (
                        <li key={index} className="text-gray-700">{prevention}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Diet Plan</h2>
                <ul className="list-disc pl-5">
                    {message.text.diet_plan?.map((diet, index) => (
                        <li key={index} className="text-gray-700">{diet}</li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default Ai