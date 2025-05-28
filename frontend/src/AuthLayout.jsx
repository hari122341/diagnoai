import React from 'react'
import { Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const AuthLayout = ({ children, authentication = true }) => {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/signin")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)

    }
        , [authStatus, authentication, navigate])


    return loader ? null : <> {children}
    </>
}

export default AuthLayout