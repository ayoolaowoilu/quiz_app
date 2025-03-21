import React, { useState,useContext } from "react"
import axios from "axios"
import loader from "../../assets/Rolling@1x-1.0s-200px-200px.gif"
import { dataContext } from "../provider"

import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
export default function Multi(){
  interface question {
    question:String,
    o1:String,
    o2:String,
    o3:String,
    o4:String,
    answer:String
}
    const [toggle,settoggle] = useState<Boolean>(false)
    const [questions,setquestions] = useState<question[] | null>([])
    const [code,setcode] = useState<String>("")
    const [stage , setstage ] = useState({
        question:"",
        o1:"",
        o2:"",
        o3:"",
        o4:"",
        answer:""
    })
   
   const [loading,setloading]= useState<boolean>(false)
   const [msg,setmsg] = useState<String>("")
   const [not,setnot] = useState<Boolean>(false)
    const data = useContext(dataContext)
    
    const handleinputschange = (e:React.ChangeEvent<HTMLInputElement>) =>{
       setstage({...stage,[e.target.name]:e.target.value})
    }
    const handlepushquestion = ()=>{
            setquestions((que:any)=>[...que , stage])
            console.log(questions)
            setstage({
                question:"",
                o1:"",
                o2:"",
                o3:"",
                o4:"",
                answer:""
            })
    }
   const handlesubmit =async()=>{
    try {
      setloading(true)
      setnot(false)
      setmsg("")
      const payload = {
        code:"mcq-"+code,
        user:data?.email,
        questions
      }
      if(!questions?.length && code === "" || code === "" || !questions?.length){
        setmsg("## Input A code or add a question")
        setloading(false) 
        setnot(true)
        setTimeout(() => {
          setnot(false)
          setmsg("")
        }, 5000);
      }else{
        
        //
        const resp = await axios.post(`${import.meta.env.VITE_URL}/quiz/question`,payload)
        setmsg(resp.data.msg)
        setloading(false) 
        setnot(true)
        setTimeout(() => {
          setnot(false)
          setmsg("")
        }, 5000);

      }
      
     
    } catch (err) {
      setmsg("## " + err)
        setloading(false) 
        setnot(true)
        setTimeout(() => {
          setnot(false)
          setmsg("")
        }, 5000);
    }
   }
   const logout =()=>{
    localStorage.removeItem("token")
    window.location.reload()
  }
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
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/join-quiz">Join quiz</a>
            </li>

            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75 border-b-4" href="/create-quiz"> Create quiz code </a>
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
                href="#"
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
               stats
              </a>
            </div>

            <div className="p-2">
              <form  action="#">
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
              </form>
            </div>
          </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>
               {not ? <div
               className={msg?.includes("##") ? " fixed top-[60px] w-full p-[10px] bg-red-50 text-red-700" : "fixed top-[60px] p-[10px] bg-green-50 text-green-700"}>
                {msg}
               </div> : null}
               <h1 className="text-center font-bold m-[10px] text-3xl">Multi choice question setter</h1>
              
               <div className="mx-auto flex-col flex justify-center">
               <div className="text-center">Create Room Code</div>
               <input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setcode(e.target.value)}  className="mx-auto border-4 p-[10px]  m-[10px]" placeholder="" />
               </div>

               <div>
                {questions?.map((question,index)=>{
                    return(
                        <div key={index} className="bg-white mx-auto w-4/5 shadow-xl border-4 rounded-xl p-[10px] m-[10px] ">
                              <div className="font-bold">Q:{index +1}</div>
                              <div className="font-bold m-[10px]">Question : {question.question}?</div>
                              <ul>
                                <li> <span className={question.o1 === question.answer ? "font-bold text-green-600" : "font-bold"}>Option 1 :</span> "{question.o1}"</li>
                                <li> <span className={question.o2 === question.answer ? "font-bold text-green-600" : "font-bold"}>Option 2 :</span> "{question.o2}"</li>
                                <li><span className={question.o3 === question.answer ? "font-bold text-green-600" : "font-bold"}>Option 3 :</span> "{question.o3}"</li>
                                <li> <span className={question.o4 === question.answer ? "font-bold text-green-600" : "font-bold"}>Option 4 :</span> "{question.o4}"</li>
                              </ul>
                              <div><span className="font-bold m-[10px]">Answer</span><span className="text-green-600 font-bold ">{question.answer}</span></div>
                        </div>
                    )
                })}
                {loading ? <button
        onClick={handlesubmit}
        className=" flex m-[10px]  opacity-50 rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white ">
         <span> Submiting questions... </span> <img src={loader} width={"30px"} height={"30px"} alt="" />
      </button> : <button
        onClick={handlesubmit}
        className="flex  m-[10px] rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white ">
       Submit Questions
      </button>} 
               </div>
                   <div className="bg-[#ccc] md:flex md:justify-between p-[10px] rounded-xl justify-between text-white">
                     <div className="mx-auto">
                        <div>Input Question</div>
                     <textarea
                     
                     onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>setstage({...stage,[e.target.name]:e.target.value})}
                       name="question"
                       value={stage.question}
                        placeholder="Input-Question"
                        className=" m-[10px] bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs mx-auto transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
                 ></textarea>
                 <div>Input Answer</div>
                   <input type="text"
                   onChange={handleinputschange}
                   value={stage.answer}
                   name="answer"
                    className=" m-[10px] mx-auto bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden"
                    />
                     </div>
                     <div className="flex mx-auto flex-col m-[10px] mx-auto">
                     <div>Option 1</div>
                        <input 
                         onChange={handleinputschange}
                         value={stage.o1}
                        name="o1"
                        type="text" 
                        className=" m-[10px] bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden mx-auto" />
                        <div>Option 2</div>
                        <input type="text" 
                         onChange={handleinputschange}
                         value={stage.o2}
                        name="o2"
                        className=" m-[10px] bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden mx-auto" />
                        <div>Option 3</div>
                        <input type="text" 
                         onChange={handleinputschange}
                         value={stage.o3}
                        name="o3"
                        className=" m-[10px] bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden mx-auto" />
                        <div>Option 4</div>
                        <input type="text" 
                         onChange={handleinputschange}
                         value={stage.o4}
                        name="o4"
                        className=" m-[10px] bg-inherit border-4 outline-none w-full rounded-md border-gray-200 bg-white p-3 text-gray-700 shadow-xs transition focus:border-white focus:ring-3 focus:ring-yellow-400 focus:outline-hidden mx-auto" />
                      <button
        onClick={handlepushquestion}
        className="w-full mx-auto rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white "
      >
       Set Question
      </button>
                     </div>
                   </div>
                       
                       <footer className="bg-white">
                         <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
                           <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                             <div>
                               <div className="text-teal-600">
                                 <img src={logo}  width={"70px"} height={"70px"} alt="" />
                               </div>
                       
                               <p className="mt-4 max-w-xs text-gray-500">
                                Hyper quizis 
                               </p>
                       
                               <ul className="mt-8 flex gap-6">
                                 <li>
                                   <a
                                     href="#"
                                     rel="noreferrer"
                                     target="_blank"
                                     className="text-gray-700 transition hover:opacity-75"
                                   >
                                     <span className="sr-only">Facebook</span>
                       
                                     <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                       <path
                                         fillRule="evenodd"
                                         d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                         clipRule="evenodd"
                                       />
                                     </svg>
                                   </a>
                                 </li>
                       
                                 <li>
                                   <a
                                     href="#"
                                     rel="noreferrer"
                                     target="_blank"
                                     className="text-gray-700 transition hover:opacity-75"
                                   >
                                     <span className="sr-only">Instagram</span>
                       
                                     <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                       <path
                                         fillRule="evenodd"
                                         d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                         clipRule="evenodd"
                                       />
                                     </svg>
                                   </a>
                                 </li>
                       
                                 <li>
                                   <a
                                     href="#"
                                     rel="noreferrer"
                                     target="_blank"
                                     className="text-gray-700 transition hover:opacity-75"
                                   >
                                     <span className="sr-only">Twitter</span>
                       
                                     <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                       <path
                                         d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                                       />
                                     </svg>
                                   </a>
                                 </li>
                       
                                 <li>
                                   <a
                                     href="#"
                                     rel="noreferrer"
                                     target="_blank"
                                     className="text-gray-700 transition hover:opacity-75"
                                   >
                                     <span className="sr-only">GitHub</span>
                       
                                     <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                       <path
                                         fillRule="evenodd"
                                         d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                         clipRule="evenodd"
                                       />
                                     </svg>
                                   </a>
                                 </li>
                       
                                 <li>
                                   <a
                                     href="#"
                                     rel="noreferrer"
                                     target="_blank"
                                     className="text-gray-700 transition hover:opacity-75"
                                   >
                                     <span className="sr-only">Dribbble</span>
                       
                                     <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                       <path
                                         fillRule="evenodd"
                                         d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                                         clipRule="evenodd"
                                       />
                                     </svg>
                                   </a>
                                 </li>
                               </ul>
                             </div>
                       
                             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
                               <div>
                                 <p className="font-medium text-gray-900">Services</p>
                       
                                 <ul className="mt-6 space-y-4 text-sm">
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Company Review </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> HR Consulting </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> SEO Optimisation </a>
                                   </li>
                                 </ul>
                               </div>
                       
                               <div>
                                 <p className="font-medium text-gray-900">Company</p>
                       
                                 <ul className="mt-6 space-y-4 text-sm">
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> About </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Meet the Team </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Accounts Review </a>
                                   </li>
                                 </ul>
                               </div>
                       
                               <div>
                                 <p className="font-medium text-gray-900">Helpful Links</p>
                       
                                 <ul className="mt-6 space-y-4 text-sm">
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Contact </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> FAQs </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Live Chat </a>
                                   </li>
                                 </ul>
                               </div>
                       
                               <div>
                                 <p className="font-medium text-gray-900">Legal</p>
                       
                                 <ul className="mt-6 space-y-4 text-sm">
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Accessibility </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Returns Policy </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75"> Refund Policy </a>
                                   </li>
                       
                                   <li>
                                     <a href="#" className="text-gray-700 transition hover:opacity-75">
                                       Hiring-3 Statistics
                                     </a>
                                   </li>
                                 </ul>
                               </div>
                             </div>
                           </div>
                       
                           <p className="text-xs text-gray-500">&copy; 2022. Company Name. All rights reserved.</p>
                         </div>
                       </footer> 
            
        </>
    )
}