

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

  type update_data = {
         id:any,
         failed:number,
         passed:number,
         userId?:number,
         reward?:number,
         score?:number,
         passingScore?:number,
         name?:string,
         time_taken?:number,
         date_taken?:number,
         creator_id?:number
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

  const fetchRandomQuizzes = async () => {
    try {
       const response = await fetch(`${API_URL}/quizes/random10`);
        const data = await response.json();
        return data;
}

      catch (error) {
         throw new Error("Failed to fetch random quizzes" + error);
      }
}

const fetchSearchByQuery = async (query:string) => {
    try {
       const response = await fetch(`${API_URL}/quizes/searchquery`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({query})
       });
        const data = await response.json();
        return data;
}catch (error) {
         throw new Error("Failed to fetch search results" + error);
      }}

      //type, name, creator_id, material, reward, isOneTime, isTimed, duration, tags, questions, time, passing_score

      type post_quiz = {
            type:"MCQ" | "SAQ" | "TOF",
            name:string,
            creator_id:any,
            material:string,
            reward:any,
            isOneTime:number,
            isTimed:number,
            duration:number,
            tags:string[],
            questions:any[],
            time:any,
            passing_score:number
      }


      const Add_quiz = async(data:post_quiz)=>{
              try {
                  const resp = await fetch(`${API_URL}/quizes/create-quiz`,{
                     method:"POST",
                     headers:{"Content-Type":"application/json"},
                     body:JSON.stringify(data)
                  })

                  const GotenData = await resp.json();

                  return GotenData;             
              } catch (error) {
               throw new Error("Error posting quiz try again!")
              }
      }

      const GetQuizesByCreatorId = async(id:number)=>{
              try {
                  const resp = fetch(`${API_URL}/players/quizzes/${id}`)
                  return (await resp).json();
              } catch (error) {
               throw new Error("Error Fetching Data")
              }
      }
      const GetQuizParticipantsHistory = async (creator_id:number) =>{
            try{
                const resp = fetch(`${API_URL}/players/recents1/${creator_id}`)
                 return (await resp).json()
            }catch(error){
                  throw new Error("Error Fetching Data")
            }
      }

        const getUserNameById = async(id:number)=>{
                try {
                    const resp = await fetch(`${API_URL}/players/get/${id}`)
                    const data = await resp.json();
                   
                    return data.username;
                } catch (error) {
                    throw new Error("Error fetching user name");
                }
        }

        // userId, followedId 

        const followUser = async(followerId:number, followingId:number)=>{
             console.log(followerId, followingId)
             const resp = await fetch(`${API_URL}/players/follow`,{
                  method:"POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify({userId:followerId, followedId:followingId})
             })
              return await resp.json();
        }


      

  export { getQuizById,updateQuiz,fetchRandomQuizzes , fetchSearchByQuery , Add_quiz , GetQuizesByCreatorId , GetQuizParticipantsHistory , getUserNameById ,followUser}