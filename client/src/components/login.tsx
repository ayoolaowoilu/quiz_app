import loder from "../assets/Rolling@1x-1.0s-200px-200px.gif"
import axios from "axios"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
export default function Login(){
  const [loading , setloading]= useState<Boolean>(false)
  const [msg,setmsg] = useState<String>("")
  const navigate = useNavigate()
    const [not,setnot] = useState<Boolean>(false)
    const [profile,setprofile] = useState({
      email:"",
      password:""
    })
    const handlechange =(e:React.ChangeEvent<HTMLInputElement>)=>{
        setprofile({...profile,[e.target.name]:e.target.value})
    }
    const handlesubmit =async(e:FormEvent)=>{
      e.preventDefault()
      setloading(true)
      setnot(false)
      setmsg("")
      try {
        const resp = await axios.post(`${import.meta.env.VITE_URL}/auth/login`,profile)
        setloading(false)
        setnot(true)
        setmsg(resp.data.msg)
        if(resp.data.token){
          localStorage.setItem("token",resp.data.token)
          setloading(true)
          setTimeout(() => {
              navigate("/home")
          }, 3000);
        }
      } catch (err) {
       
        setloading(false)
        setnot(true)
        setmsg("## " + err)
      }
    }
    document.title ="Login page"
   return(
    <div>
        
        {not ?  <div role="alert" className={ msg?.includes("##") ? "mx-auto rounded-sm border-s-4 border-red-500 bg-red-50 p-4" : " mx-auto rounded-sm border-s-4 border-green-500 bg-green-50 p-4"}>
  <strong className={msg?.includes("##") ? "block font-medium text-red-800" : "block font-medium text-green-800" }> {msg?.includes("##") ? "Something went wrong" : "Sucessfull"} </strong>

<p className={ msg?.includes("##") ? "mt-2 text-sm text-red-700" : "mt-2 text-sm text-green-700" }>
    {msg}
  </p>
</div> : null}
<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg text-center">
    <h1 className="text-2xl font-bold sm:text-3xl">Login page</h1>

    <p className="mt-4 text-gray-500">
     Welcome to hyper quizes A place you can learn
    </p>
  </div>

  <form action="#" onSubmit={handlesubmit} className="mx-auto mt-8 mb-0 max-w-md space-y-4">
    <div>
      <label htmlFor="email" className="sr-only">Email</label>

      <div className="relative">
        <input
          type="email"
          name="email"
          onChange={handlechange}
          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
          placeholder="Enter email"
        />

        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        </span>
      </div>
    </div>

    <div>
      <label htmlFor="password" className="sr-only">Password</label>

      <div className="relative">
        <input
          type="password"
          name="password"
          onChange={handlechange}
          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs"
          placeholder="Enter password"
        />

        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        No account?
        <a className="underline" href="/reg">Sign up</a>
      </p>

     {!loading ?  <button
        type="submit"
        className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
      >
        Sign in
      </button> :  <button
        type="submit"
        className=" flex inline-block rounded-lg bg-blue-500 opacity-50 px-5 py-3 text-sm font-medium text-white"
      >
       <span className="my-auto">Sign in</span>
        <img src={loder} width={"30px"} height={"30px"} alt="" />
      </button> }
    </div>
  </form>
</div>
    </div>
   )
}