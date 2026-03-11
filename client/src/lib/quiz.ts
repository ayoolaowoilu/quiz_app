

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

  type update_data = {
         id:any,
         failed:number,
         passed:number
  }
  const updateQuiz  = async(data:update_data)=>{
          try {
             const response = await fetch(`${API_URL}/quizes/update-when-taken`,{
                 method:"POST",
                 headers:{"Content-Type":"application/json"},
                 body:JSON.stringify(data)
             })
              const dataa = await response.json()
        
               return dataa;
         } catch (error) {
          console.log(error)
         }   
  }

  export { getQuizById,updateQuiz }