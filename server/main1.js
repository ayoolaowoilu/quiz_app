import express from "express";
import mysql from "mysql2/promise"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
dotenv.config()

const auth = express.Router()
const db = await mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.PORTE
})
if(db){
    console.log("✅Database connected ")
}else{
    console.log("❌Database could not connect")
}
auth.post("/reg",async(req,res)=>{
    try {
        const { email ,password } = req.body
        const [resp] = await db.query("SELECT COUNT(*) as count FROM users WHERE email=? ",[email])
       if(resp[0].count > 0){
         res.send({msg:"## Email already taken"})
       }else{
        const salt = 10
        const hash = await bcrypt.hash(password,salt)
        await db.query("INSERT INTO users(email,_password) VALUES(?,?)" , [email,hash])
         res.send({msg:"Account created sucessfully proceed to login page"})
       }
    } catch (err) {
        console.log(err)
    }
})
auth.post("/login",async(req,res)=>{
    try {
        const { email,password } = req.body
        const [resp] = await db.query("SELECT * FROM users WHERE email=? ",[email])
        
        if(resp.length){
            const verifypass = await bcrypt.compare(password,resp[0]._password)
            if(verifypass){
                const payload = {
                    email:email
                }
                const token = jwt.sign(payload,process.env.ACCESS_TOKEN)
                res.send({msg:"Login sucessful" , token:token})
            }else{
                res.send({msg:"## Account not found"})
            }
        }else{
            res.send({msg:"## Account not found"})
        }
    } catch (err) {
        console.log(err)
    }
})
const authentication = (req,res,next) =>{
    const header = req.headers["authorization"]
    const token = header && header.split(" ")[1]

    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err){
            res.send({msg:"Invalid token"})
        }else{
            req.user = decoded
            next()
        }
    })
}
auth.get("/userdata",authentication,async(req,res)=>{
    try {
        const email = req.user.email
        const [resp]= await db.query("SELECT * FROM users WHERE email=?",[email])
        res.send(resp[0])
    } catch (err) {
        console.log(err)
    }
})
export default auth;
