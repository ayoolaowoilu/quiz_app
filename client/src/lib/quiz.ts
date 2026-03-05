
const API_URL = import.meta.env.VITE_URL || "http://localhost:1234";

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