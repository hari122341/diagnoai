import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Sign-up'
import Main from './pages/Chat/Main'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Home />
      {/* <Signup /> */}
      {/* <Main /> */}
    </>
  )
}

export default App
