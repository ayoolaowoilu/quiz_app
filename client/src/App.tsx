
import Login from './components/login'
import Home from "./components/home"
import Reg from './components/reg'
import Auth from './components/auth'
import Gen from './components/gen'
import SetUsername from './components/setusername'
import { CookieConsent } from './components/cookies'


import { BrowserRouter,Routes,Route } from "react-router-dom"



function App() {
  const onAccept = ()=>{
      localStorage.setItem("cookies","true")
  }
  const onReject = ()=>{
      localStorage.setItem("cookies","false")
  }
  return (
  
   <BrowserRouter>
    <CookieConsent onAccept={onAccept} onDecline={onReject} />
    <Routes>
     
     <Route  path='/login' element={<Login />} />
     <Route path="/reg" element={<Reg />} />
     <Route index path='/' element={<Gen />} />
     <Route element={<Auth />} >
     <Route path="/home" element={<Home />} />
       <Route path='/setusername' element={<SetUsername />} />
     </Route>
     
    </Routes>
   </BrowserRouter>

  )
}

export default App
