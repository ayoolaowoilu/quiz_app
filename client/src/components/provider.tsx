import React, { createContext,useEffect,useState } from "react";
import axios from "axios"
const dataContext = createContext({email:"Session Expired"})

const Provider: React.FC <{children:any}>=( {children} )=>{
    const [data,setdata] = useState({
        email:"",
    })
  const token = localStorage.getItem("token")
   const getdata = async()=>{
    try {
        const resp = await axios.get(`${import.meta.env.VITE_URL}/auth/userdata`,{
            headers:{ authorization:`bearer ${token}` }
        })
        setdata(resp.data)
        console.log(resp.data)
    } catch (err) {
        console.log(err)
    }
   }
   useEffect(()=>{
    getdata()
   },[])
   return (
     <dataContext.Provider value={data} >
        {children}
     </dataContext.Provider>
   )
}
export default Provider;
export {dataContext}

