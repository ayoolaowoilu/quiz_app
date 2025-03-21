import { dataContext } from "../provider"
import { useContext,useEffect,useState } from "react"
import logo from "../../assets/carrot-diet-fruit-svgrepo-com.svg"
import axios from "axios"
export default function Stats(){
    const data = useContext(dataContext)
    const [toggle,settoggle] = useState<Boolean>(false)
    const [score,setscore] = useState([{
        passed:"",
        failed:"",
        _code:"",
        _user:"",
        date_taken:""
    }])
    const [set,setset] = useState([{
        _code:"",
        _user:"",
        questions:[],
        date_created:""
    }])
    const getset = async() =>{
        try {
            const resp = await axios.get(`${import.meta.env.VITE_URL}/quiz/set`)
            setset(resp.data)
        } catch (err) {
            console.log(err)
        }
    }
    const get = async() =>{
       try {
          const resp = await axios.get(`${import.meta.env.VITE_URL}/quiz/scores`)
          setscore(resp.data)
       } catch (err) {
          console.log(err)
       }
    }
    useEffect(()=>{
        get()
        getset()
    },[])
    const myscores = score?.filter((sco)=> sco._user === data?.email)

    const myset = set?.filter((se)=> se._user === data?.email )
   
    const logout =()=>{
        localStorage.removeItem("token")
        window.location.reload()
      }
      const [taken,settaken] =useState<Boolean>(true)
      
   
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
              <a className="text-gray-500 transition hover:text-gray-500/75" href="/create-quiz"> Create quiz code </a>
            </li>
            <li>
              <a className="text-gray-500 transition hover:text-gray-500/75 border-b-4" href="/stats"> Stats </a>
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
                href="/home
                "
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


<h1 className="font-bold text-2xl m-[10px]">Welcome {data?.email}</h1>
<div>

  <div className="">
    <div className={"border-b border-gray-200"}>
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
       
         

        <a
          href="#"
          onClick={()=>settaken(true)}
          className={!taken ? "inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" : "inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium border-blue-500  text-blue-500 hover:border-gray-300 hover:text-gray-700"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
            />
          </svg>

         Quizes taken
        </a>

        <a
          href="#"
          onClick={()=>settaken(false)}
          className={taken ? "inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700" : "inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-medium border-blue-500  text-blue-500 hover:border-gray-300 hover:text-gray-700"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>

         Quizes set
        </a>

        
          
      </nav>
    </div>
  </div>
</div>
{taken ? <div className="p-[10px]">
    {myscores?.map((score,index)=>{
        return(
              <div key={index} className="border-4 m-[10px] p-[10px] rounded-xl flex justify-between">
                <div>
                <div>{score.date_taken?.split("T")[0]}</div>
                  <div className="font-bold m-[10px]">Room-code : {score._code}</div>
                  <div className="font-bold m-[10px] text-green-700">passed : {score.passed}</div>
                  <div className="font-bold m-[10px] text-red-700" >Failed : {score.failed}</div>
                </div>
                <div className="my-auto font-bold text-3xl">
                   {
                   Math.floor(Number(
                    Number(score.passed) /
                    (Number(score.passed) + Number(score.failed))
                   )*100)
                   }%
                </div>
                  
                  
              </div>
        )
    })}

</div> : <div>
{myset?.map((scor,index)=>{
        return(
              <div key={index} className="border-4 m-[10px] p-[10px] rounded-xl flex justify-between">
                <div>
                <div>{scor.date_created?.split("T")[0]}</div>
                  <div className="font-bold m-[10px]">Room-code : {scor._code}</div>
                  <div className="font-bold m-[10px] text-green-700">Questions : {scor.questions?.length}</div>
                  
                </div>
                <div className="my-auto ">
                    <small className="mx-auto ">Participants</small>
                    <div className="mx-auto font-bold text-3xl">
                    {
                      score?.filter((sco)=> sco._code === scor._code).length
                   }
                    </div>
                   
                </div>
                  
                  
              </div>
        )
    })}
    </div>}
        </>

    )
}