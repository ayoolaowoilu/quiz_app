import axios from "axios"
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import loader from "../../assets/Rolling@1x-1.0s-200px-200px.gif"
import { dataContext } from "../provider"
import { FormEvent, useState,useContext,useEffect } from "react"
export default function Join(){
  const data = useContext(dataContext)
  document.title = "Join quiz"
    const [toggle,settoggle] = useState<Boolean>(false)
    const [taker,settaker] = useState<Boolean>(false)
    const [loading,setloading ] = useState<Boolean>(false)
    const [code,setcode] = useState<String>("")
    const [enter,setenter] = useState<Boolean>(false)
    const [questions,setquestions] = useState([
      {
      question:"",
      o1:"",
      o2:"" ,
      o3:"",
      o4:"",
     picked:"none",
     answer:""
      }
    ])
    const [room,setroom] = useState({
      _code:"",
      _user:"",
      _time:"5min",
      date_created:""
    })
    const [msg,setmsg] = useState<String>("")
    const handlefind = async(e:FormEvent) =>{
      e.preventDefault()
      setloading(true)
     const payload = {
      code:code
     }
        try {
           const resp = await axios.post(`${import.meta.env.VITE_URL}/quiz/rooms`,payload)
           if(resp.data._code){
            setmsg("Room has been found")
             setroom(resp.data)
             setquestions(resp.data.questions)
             setloading(false)
             setenter(true)
           }else{
            setmsg("## The room code entered  was not found ")
            setloading(false)
            setenter(true)
           }
           setloading(false)
        } catch (err) {
          setmsg("## "+err)
          setloading(false)
          setenter(true)
        }
    }
    const [results,setresults] = useState<Boolean>(false)
    const passed = questions?.filter((que)=> que.answer === que.picked)
    const failed = questions?.filter((que)=> que.answer !== que.picked)
    const avg = Number(passed.length / questions.length )
    const total = Number(avg * 100)
    const logout =()=>{
      localStorage.removeItem("token")
      window.location.reload()
    }
    const [min,setmin] = useState<number>(4)
    const [sec,setsec] = useState<number>(59)
    const submitquiz = async()=>{
        setresults(true)
        setloading(true)
      try {
        const payload ={
          passed:passed?.length,
          failed:failed?.length,
          code:room?._code,
         user:data?.email,
         time:room?._time
        }
        const resp = await axios.post(`${import.meta.env.VITE_URL}/quiz/subscores`,payload)
        console.log(resp.data)
        setloading(false)
        
      } catch (err) {
        console.log(err)
      }
    }
   
     const timer =()=>{
      if (room?._time === "5min"){
        setmin(4)
        setsec(59)
     }else if(room?._time === "15min"){
       setmin(14)
       setsec(59)
     }else if(room?._time === "25min"){
       setmin(24)
       setsec(59)
     }else if(room?._time === "30min"){
      setmin(29)
      setsec(59) 
     }else if(room?._time === "1hr"){
       setmin(59)
       setsec(59)
     }else if(room?._time === "1/2hr"){
       setmin(89)
       setsec(59)
     }else if(room?._time === "2hr"){
       setmin(119)
       setsec(59)
     }
   
     
     }
    
   
   
     useEffect(() => {
      if (min === 0 && sec === 0) {
        submitquiz()
        return; 
      }
  
      const interval = setInterval(() => {
        if (sec > 0) {
          setsec(prevSeconds => prevSeconds - 1);
        } else if (min > 0 && sec === 0) {
          setmin(prevMinutes => prevMinutes - 1);
          setsec(59);
        }
      }, 1000);
  
      return () => clearInterval(interval); 
    }, [sec, min]);
  
    
    return(
        <>
 <header className="bg-white">
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      <div className="flex-1 md:flex md:items-center md:gap-12">
        <a className="block text-teal-600">
          <span className="sr-only">Home</span>
           Hyper Quizes
        </a>
      </div>

      <div className="md:flex md:items-center md:gap-12">
        <nav aria-label="Global" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75 " href="/home"> Home </a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75 border-b-4" href="/join-quiz">Join quiz</a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/create-quiz"> Create quiz code </a>
            </li>
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/stats"> Stats </a>
            </li>
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75" onClick={logout} href="#">Logout</a>
            </li>

           
          </ul>
        </nav>

        <div className="hidden md:relative md:block">
          <button
            type="button"
        
            className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
          >
            <span className="sr-only">Toggle dashboard menu</span>

            <img
              src={logo}
              alt=""
              className="size-10 object-cover"
            />
          </button>

          
        </div>
        
        <div onClick={()=>{
            if(toggle){
                settoggle(false)
            }else{
                settoggle(true)
            }
            
            }} className="block md:hidden">
          <button
            className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <div
            className={toggle ? "absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg" :"hidden"}
            role="menu"
          >
            <div className="p-2">
              <a
                href="/home"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
                Home
              </a>

              <a
                href="/join-quiz"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
               Join quiz
              </a>

              <a
                href="/create-quiz"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
               Create quiz
              </a>
              <a
                href="/stats"
                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                role="menuitem"
              >
               Stats
              </a>
            </div>

            <div className="p-2">
              
                <button
                  type="submit"
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  role="menuitem"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>

                  Logout
                </button>
             
            </div>
          </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>
{!taker ?
 <section className="bg-gray-50">
  <div className="p-8 md:p-12 lg:px-16 lg:py-24">
    <div className="mx-auto max-w-lg text-center">
        <img src={logo} width={"60px"} height={"60px"} className="mx-auto" alt="" />
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
        Join a live quiz
      </h2>

      <p className="hidden text-gray-500 sm:mt-4 sm:block">
        Input a code given by your setor to begin your quiz
        ,Wish you a greate day 😊🎉
      </p>
    </div>

    <div className="mx-auto mt-8 max-w-xl">
      <form action="#" onSubmit={handlefind} className="sm:flex sm:gap-4">
        <div className="sm:flex-1">
          <label htmlFor="email" className="sr-only">Email</label>

          <input
            type="text"
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
              setcode(e.target.value)
        }}
            placeholder="Input-code"
            className="w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
          />
        </div>

        {loading ? <button
          type="submit"
          className="group mt-4 opacity-50 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-white transition focus:ring-3 focus:ring-yellow-400 focus:outline-hidden sm:mt-0 sm:w-auto"
        >
          <span className="text-sm font-medium"> Finding... </span>
               <img src={loader} width={"30px"} height={"30px"} alt="" />
        </button> :
        <button
        type="submit"
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-white transition focus:ring-3 focus:ring-yellow-400 focus:outline-hidden sm:mt-0 sm:w-auto"
      >
        <span className="text-sm font-medium"> Find-code </span>

        <svg
          className="size-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>}
      </form>
    </div>
  </div>
  {enter ? <div className={msg?.includes("##") ? " m-[10px] mx-auto shadow-xl border-4 border-red-700 w-4/5 p-[10px] bg-red-50 text-red-800" : "mx-auto shadow-xl m-[10px] border-4 w-4/5 p-[10px]"}>
     <div className="text-center font-bold"> {msg}</div>
     {!msg?.includes("##") ? <div className="mx-auto font-bold m-[10px]">Room_code : {room?._code}</div> : <div>404 not found</div>  }
     {!msg.includes("##") ? <div className="flex flex-col ">
        <div className="m-[10px] font-bold">Questions : {questions?.length}</div>
        <div className="m-[10px] font-bold">Type : {room?._code?.split("-")[0] === "mcq" ? "Multiple choice question" : room?._code?.split("-")[0] === "saq" ? "Short answer question" : "True or false question" }</div>
        <div className="m-[10px] font-bold">Allocated time : {room?._time}</div>
        <div className="font-bold m-[10px]">Date created : {room?.date_created?.split("T")[0]}</div>
        <small className="m-[10px]">by :{room?._user}</small>
        <button
        onClick={()=>{
          settaker(true)
          timer()
        }} className="p-[10px] text-white bg-blue-500 rounded-xl ">Enter Quiz?</button>
     </div> : null }
  </div> : null}
</section>
 : results ? <div className="p-[10px] m-[10px]">
  <div className="border-4 shadow-xl p-[10px] w-4/5 mx-auto ">
  <div className="text-center text-3xl m-[10px] font-bold">Total: {Math.floor(total)}%</div>
  <div className="font-bold text-center  ">{total > 50 ? "Ya did great! 🎉🎉" : total < 30 ? "Fair 😢" : "Below average but very good 😀"}</div>
  <div>passed:{passed?.length}</div>
  <div>failed:{failed?.length}</div>

  <div className="font-bold m-[10px]">Check your stats to view results</div>

  <button className="p-[10px] m-[10px] bg-blue-500 text-white rounded-xl " onClick={()=>{settaker(false)
    setenter(false)
    setresults(false)
  }}>Take another quiz</button>
  <button className="p-[10px] m-[10px] bg-blue-500 text-white rounded-xl ">Share with friends</button>
  
  </div>
  <div className="p-[10px] m-[10px]">
     <div className="font-bold m-[10px] text-center">Answers</div>
    {questions?.map((que,index)=>{
      return(
        <div key={index} className={que.picked === que.answer ? "border-4 border-green-700 p-[10px] bg-green-50 text-green-700 m-[10px]" : " m-[10px] border-4 border-red-700 p-[10px] text-red-700 bg-red-50" }>
          <div className="m-[10px]">{que.picked === que.answer ? "✅ Correct" : "❌ Wrong" }</div>
           <div className="m-[10px]">{index + 1}. {que.question}</div>
           <div className="m-[10px] font-bold">You picked : {que.picked}</div>
           <div className="m-[10px] font-bold">Answer : {que.answer}</div>
           
        </div>
      )
    })}
  </div>
 </div> : <div className="p-[10px]">
      <div className={min < 5 ? "font-bold m-[10px] text-red-700 bg-white border-4 p-[10px] fixed top-[60px] shadow-xl" : "font-bold m-[10px] text-green-700 bg-white border-4 p-[10px] fixed top-[60px] shadow-xl" }>Timer : {min < 10 ? `0${min}` : `${min}`} : {sec < 10 ? `0${sec}` : `${sec}`} </div>
      <br />
      <br />
      <br />
    {questions?.map((que,index)=>{
      
      return(
        <div className="m-[10px] p-[10px] border-4 ">
          
          <div className="m-[10px] font-bold ">{index+1}</div>
          <div className="m-[10px] font-bold">{que?.question}</div>
          <ul>
            {room?._code?.split("-")[0] === "mcq" ?
              <div className="flex flex-col ">
                <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio"  value={que?.o1}  id="" /> <span className="font-bold">{que?.o1}</span></div>
                <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio"  value={que?.o2}  id="" /> <span className="font-bold">{que?.o2}</span></div>
                <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio" value={que?.o3}  id="" /> <span className="font-bold">{que?.o3}</span></div>
                <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio"  value={que?.o4}  id="" /> <span className="font-bold">{que?.o4}</span></div>
              </div>
            : room?._code?.split("-")[0] === "tof" ? 
            <div className="flex flex-col " >
              <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio"  value={que?.o1}  id="" /> <span className="font-bold">{que?.o1}</span></div>
                <div><input onChange={
                   (e:React.ChangeEvent<HTMLInputElement>) => {
                    setquestions((prevItems) =>
                      prevItems.map((item:any) =>
                        item.question === que?.question  ? { ...item, picked:e.target.value} : item
                      )
                    );
                  }
                
                } name={`${index}`} type="radio"  value={que?.o2}  id="" /> <span className="font-bold">{que?.o2}</span></div>
            </div > : <input type="text" onChange={
               (e:React.ChangeEvent<HTMLInputElement>) => {
                setquestions((prevItems) =>
                  prevItems.map((item:any) =>
                    item.question === que?.question  ? { ...item, picked:e.target.value} : item
                  )
                );
              }
            }  className="p-[10px] m-[10px] border-4" placeholder="Input your awnser" /> }
          </ul>
        </div>
      )
    })}
    <button onClick={submitquiz} className="p-[10px] text-white bg-blue-500 rounded-xl">Submit</button>
 </div> }
        </>
    )
}