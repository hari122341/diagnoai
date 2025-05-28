import React, { useState } from 'react'

import Apicontext from './Apicontext'
const ApiContextProvier = ({ children }) => {
    const [url, seturl] = useState(null)
    const [file, setfile] = useState(null)
    return (
        <Apicontext.Provider value={{ url, seturl, file, setfile }}>
            {children}

        </Apicontext.Provider>
    )
}

export default ApiContextProvier