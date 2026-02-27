
import Login from './components/login'
import Home from "./components/home"
import Reg from './components/reg'
import Auth from './components/auth'
import Gen from './components/gen'
import Provider from './components/provider.tsx'

import { BrowserRouter,Routes,Route } from "react-router-dom"

function App() {
  return (
    <Provider>
   <BrowserRouter>
    <Routes>
     <Route  path='/login' element={<Login />} />
     <Route path="/reg" element={<Reg />} />e 
     <Route index path='/' element={<Gen />} />
     <Route element={<Auth />} >
     <Route path="/home" element={<Home />} />
     </Route>
     
    </Routes>
   </BrowserRouter>
    </Provider>
  
  )
}

export default App
