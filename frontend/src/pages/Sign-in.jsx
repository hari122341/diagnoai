import Login from '@/components/Login'
import React from 'react'

const Signin = () => {
    return (
        <div className="flex min-h-screen lex-col items-center justify-center bg-gray-900 p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <Login />
            </div>
        </div>
    )
}

export default Signin