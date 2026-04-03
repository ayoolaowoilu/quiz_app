
import Login from './components/login'
import Home from "./components/home"
import Reg from './components/reg'
import Auth from './components/auth'
import Gen from './components/gen'
import SetUsername from './components/setusername'
import { CookieConsent } from './components/cookies'


import { BrowserRouter,Routes,Route } from "react-router-dom"
import Terms from './components/tpa/terms'
import Privacy from './components/tpa/privacy'
import About from './components/tpa/about'
import Contact from './components/tpa/contact'
import ProfileSettings from './components/profile'
import Stats from './components/stats'
import JoinQuiz from './components/Quiz/join-quiz'
import CreateQuiz from './components/Quiz/create-quiz'
import Explore from './components/Quiz/explore'
import PlayerInfo from './components/PlayerInfo'



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
     <Route  path="/terms" element={<Terms />} />
     <Route path='/privacy' element={<Privacy />} />
     <Route path="/about" element={<About />} />
     <Route path='/contact' element={<Contact />} />
     <Route path="/stats" element={<Stats />} />
     <Route path='/explore' element={<Explore />} />
     <Route path='/join-quiz' element={<JoinQuiz />} />
     <Route path='/playerinfo' element={<PlayerInfo />} />
     <Route element={<Auth />} >
     <Route path="/home" element={<Home />} />
     <Route path='/profile' element={<ProfileSettings />} />
       <Route path='/setusername' element={<SetUsername />} />
       <Route path='/create-quiz' element={<CreateQuiz />} />
     </Route>
     
    </Routes>
   </BrowserRouter>

  )
}

export default App
