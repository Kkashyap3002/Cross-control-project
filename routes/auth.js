const express=require('express')
const bcrypt= require("bcrypt")
const jwt=require('jsonwebtoken')
const router= express.Router()
require('dotenv').config()
const Users=require('../schema/users')

const randomGenerator = (n) => {
    let res = Math.floor(Math.random()*Math.pow(10, n))+1
    res = String(res)
    return res
}

router.post('/createuser',async (req, res)=>{
    try {
        const {name, pwd}= req.body

        let newUser= await Users.findOne({name: name})
        if(newUser){
            return res.status(401).send("A user alredy exists with this email")
        }

        const salt = await bcrypt.genSaltSync(10);
        const securePwd = await bcrypt.hash(req.body.pwd, salt);

        const userSecret=randomGenerator(10) //make a random number here

        newUser= await Users.create({name, pwd: securePwd, userSecret})

        const userId= newUser.id;
        const auth_token= jwt.sign({userId}, userSecret)
        res.status(201).send({name, 'auth-token':auth_token, secret: userSecret})

    } catch (error) {
        return res.status(401).send('Internal Server Error')
    }
})

router.post('/login', async (req, res)=>{
    try {
        const {name, pwd}=req.body
        const findUser= await Users.findOne({name: name})
        if(!findUser)
            return res.status(404).send("Invalid User Credentials")
        
        const passwordCompare = await bcrypt.compare(pwd, findUser.pwd)
        if(!passwordCompare)
            return res.status(404).send("Invalid User Credentials")
        
        const userId=findUser._id, userSecret=findUser.userSecret
      
        
        const auth_token=jwt.sign({'userId':userId},userSecret)
        res.status(201).json({'auth-token': auth_token, name: name, secret: userSecret})

    } catch (error) {
        return res.status(401).send('Internal Server Error')
    }
})


module.exports= router