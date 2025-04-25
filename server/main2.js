import express from "express";
import mysql from "mysql2/promise"
import dotenv from "dotenv"
const quiz = express.Router()
const db = await mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.PORT
})
if(db){
    console.log("✅ Quiz database opened")
}else{
    console.log("❌ Quiz database closed")
}

quiz.post("/question",async(req,res)=>{
    try {
        const { code,user,questions,time } = req.body
        const [resp] = await db.query("SELECT COUNT(*) as count FROM quiz WHERE _code = ?" ,[code])
        if(resp[0].count > 0) {
            res.send({msg:"## A room with this code already exists"})
        }else{
            await db.query("INSERT INTO quiz(_code,_user,questions,_time) VALUES(?,?,?,?)",[code,user,JSON.stringify(questions),time])
            res.send({msg:"Questions Added"})
        }
    } catch (err) {
        console.log(err)
    }
})
quiz.post("/rooms",async(req,res)=>{
    try {
        const code = req.body.code
        
        const [resp] = await db.query("SELECT * FROM quiz WHERE _code =? ",[code])
        res.send(resp[0])
        
    } catch (err) {
        console.log(err)
    }
})
quiz.post("/subscores",async(req,res)=>{
    try {
        const  {passed,failed,code,user} = req.body
        await db.query("INSERT INTO scores(passed,failed,_code,_user)  VALUES(?,?,?,?)",[passed,failed,code,user])
        res.send({msg:"test taken sucessfully"})
    } catch (err) {
        console.log(err)
    }
})
quiz.get("/scores",async(req,res)=>{
    try {
        const [resp] = await db.query("SELECT * FROM scores")
        res.send(resp)
    } catch (err) {
        console.log(err)
    }
})
quiz.get("/set",async(req,res)=>{
    try {
        const [resp] = await db.query("SELECT * FROM quiz")
        res.send(resp)
    } catch (err) {
        console.log(err)
    }
})
export default quiz;
