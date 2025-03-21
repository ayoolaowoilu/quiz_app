
import Login from './components/login'
import Home from "./components/home"
import Join from './components/pages/join-quiz'
import Create from './components/pages/create-quiz'
import Multi from './components/pages/multichoice'
import Tof from './components/pages/trueorfalse'
import Saq from './components/pages/saq'
import Reg from './components/reg'
import Auth from './components/auth'
import Gen from './components/gen'
import Provider from './components/provider.tsx'
import Stats from './components/pages/stats'
import { BrowserRouter,Routes,Route } from "react-router-dom"

import "./style.css"
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
     <Route path="/stats" element={<Stats />} />
     <Route path="/join-quiz" element={<Join />} />
     <Route path="/create-quiz" element={<Create />} />
     <Route path="/quiz/multichoice" element={<Multi />} />
     <Route path="quiz/trueorfalse" element={<Tof />} />
     <Route path='quiz/saq' element={<Saq />}  />
     </Route>
     
    </Routes>
   </BrowserRouter>
    </Provider>
  
  )
}

export default App
