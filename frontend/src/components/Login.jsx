import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from 'react-router-dom'
import authService from '@/appwrite/Auth'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [valid, setValid] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const session = await authService.login({
                email,
                password
            })

            if (session) {
                setValid(true)
                navigate('/chat') // Navigate to chat page after successful login
            }
        } catch (error) {
            console.error('Login failed:', error)
            setValid(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="dark min-h-150 flex items-center justify-center bg-gray-900 w-full">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-white text-center">Login</h2>
                <p className="mt-2 text-center text-gray-400">Access your account</p>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <Label htmlFor="email" className="text-gray-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            className="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Enter your Email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="flex flex-col mb-6">
                        <Label htmlFor="password" className="text-gray-300">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            className="px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Enter your password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                    >
                        Sign in
                    </Button>
                    <Link to="/signup">
                        <Button
                            type="button"
                            className="w-full mt-4 py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                        >
                            Register
                        </Button>
                    </Link>
                    {valid ?
                        ' ' : <p className="text-center text-red-500 mt-4">Invalid email or password</p>
                    }
                </form>
            </div>
        </div>
    )
}

export default Login