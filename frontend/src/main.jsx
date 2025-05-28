import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Routes } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import AuthLayout from './AuthLayout'
import Signin from './pages/Sign-in'
import Signup from './pages/Sign-up'
import { Provider } from 'react-redux'
import store from '@/store/store.js'
import Main from '@/pages/Chat/Main'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route path='' element=
          {<Home />} />
        {/* <Route path="about" element={<About />} />
        <Route path="user" element={<User />} /> */}
        {/* <Route path="github" element={<Github />} loader={githubInfoLoader} /> */}


      </Route>
      {/* <Route element={<AuthLayout authentication={false} />}> */}
      <Route path="signin" element={<Signin />} />

      <Route path="signup" element={<Signup />} />
      {/* </Route> */}
      {/* <Route path="chat" element={<Main />} /> */}
      {/* <Route path="chat">
        <Route element={<Main />} />

      </Route> */}
      <Route path="chat" element={<Main />} />


    </Route>


  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App />
     */}
    {/* <Provider store={store}> */}
    <RouterProvider router={router} />
    {/* </Provider> */}
  </StrictMode>,
)
