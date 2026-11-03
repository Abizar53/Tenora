import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './signup.jsx'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './Login.jsx'
import Home from './home.jsx'
import ProductCatalog from './ProductCatalog.jsx'
import Profile from './Profile.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path ='/signup' element ={<Signup />}></Route>
      <Route path ='/login' element ={<Login />}></Route>
      <Route path='/home'  element={<ProductCatalog />} />  
      <Route path='/profile' element={<Profile />} />
    </Routes>
    </BrowserRouter>
  )

}

export default App
