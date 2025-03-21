import express from "express"
import auth from "./main1.js"
import quiz from "./main2.js"
import cors from "cors"


const app = express()
app.use(
    cors({
        origin:"*",
        methods:['GET','POST','PUT','DELETE','OPTIONS']
    })
  );
  
  app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin','X-Requested-With','Content-Type','Accept')
    res.header('Access-Control-Allow-Methods','GET , POST , PUT , DELETE , OPTIONS')
    next()
})
app.use(express.json())
app.use("/auth",auth)
app.use("/quiz",quiz)

app.listen(1111,()=>{
    console.log("Listining at port 1111")
})