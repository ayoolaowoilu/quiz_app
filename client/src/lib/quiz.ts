const API_URL = import.meta.env.VITE_URL || "http://localhost:1234";

// import { createClient } from "redis";

// const client = createClient({
//      url:API_URL
// })

// client.connect()







 const getQuizById = async(id:number) =>{
         try {
             const response = await fetch(`${API_URL}/quizes/getbyid/${id}`)
              const data = await response.json()
        
               return data;
         } catch (error) {
          console.log(error)
         }
  }

  export { getQuizById }