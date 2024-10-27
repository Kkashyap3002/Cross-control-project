const express=require('express')
const bcrypt= require("bcrypt")
const jwt=require('jsonwebtoken')
require('dotenv').config()
const fetch = require('node-fetch')
const Users=require('../schema/users')
const Devices= require('../schema/devices')
const fetchuser= require('../middleware/fetchuser')
const tempdata= require('../schema/tempdata')
const router= express.Router()

router.post('/newdevice', fetchuser, async (req, res)=>{    //PC compare pwd here also..same as login
    try {
        const {deviceName, url}=req.body
        const userId=req.userId
        const username= await Users.findById(userId)
        if(!username)
            return res.status(404).send({"err": "user not found"})

        // let newDevice = await Devices.findOne({url: url})
        // if(newDevice)
        //     return res.status(401).json({"err": "This pc is already added"})
       let newDevice= await Devices.create({deviceName, userId, userName: username.name, url})
        res.status(201).json({deviceName: newDevice.name, deviceId:newDevice._id, userName: newDevice.userName, url: newDevice.url, active: newDevice.active , userSecret: req.userSecret})

    } catch (error) {
        res.status(400).send('Internal Server Error')
    }  
})

router.post('/devicelist', fetchuser, async ( req, res) =>{  //User
    try {
        const userId=req.userId
        const user= Users.findOne({_id: userId})
        if(!user)
            return res.status(404).json({"err": "User Foundn't"})

        const allDevices=await Devices.find({userId: userId}).select('-userId').select('-secret')
        res.status(200).json(allDevices)
    } catch (error) {
        res.status(401).send('Internal Server Error')
    }
})

router.patch('/toggleactive/:pcid', fetchuser, async ( req, res) =>{    //PC
    try {
        const userId=req.userId

        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        if(!thisDevice)
            return res.status(404).json({"error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"error": "This PC belongs to another user"})
        
        let resultt
        if(thisDevice.active===true)
             resultt= await Devices.findOneAndUpdate({_id: req.params.pcid}, {active: false})
        else
            resultt= await Devices.findOneAndUpdate({_id: req.params.pcid}, {active: true})

        if(resultt)
            resultt=await Devices.findOne({_id: req.params.pcid}).select('-userId').select('-secret')
        console.log("toggledActive")
        res.status(200).json({resultt})

        

    } catch (error) {
        res.send('Internal Server Error')
    }
})

router.post('/getdetailpc/:pcid', fetchuser, async ( req, res) =>{    //PC
    try {
        const userId=req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})

        if(!thisDevice)
            return res.status(404).json({"error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"error": "This PC belongs to another user"})
        
        var result=await Devices.findOne({_id: req.params.pcid}).select('-userId').select('-secret')
        res.status(200).json(result)

    } catch (error) {
        res.send('Internal Server Error')
    }
})


router.delete('/delete/:pcid', fetchuser, async ( req, res) =>{ //PC
    try {
        const userId=req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        if(!thisDevice)
            return res.status(404).json({"error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"error": "This PC belongs to another user"})
     
        const resultt= await Devices.findOneAndDelete({_id: req.params.pcid})
        console.log('deletion successful')
        res.status(200).json({resultt})  

    } catch (error) {
        return res.status(404).send('Internal Server Error')
    }
})


router.post('/loadtasks/:pcid', fetchuser, async (req,res)=>
{
    try{
        const userId= req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        if(!thisDevice)
            return res.status(404).json({"error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"error": "This PC belongs to another user"})
 
        const {url} = req.body
        const token= req.headers['auth-token']
        const options={
            method: 'GET',
            headers:{
                "Content-Type": "application/json",
                "auth-token": token  
            }
        }
    //console.log(options)
    let ress= await fetch(url+'/api/tasklist', options)
    ress= await ress.json()
    res.status(200).json(ress)
}
catch(err)
{
    console.log('error in trial' , err)
    res.status(400).json({"status": "failed", "error": "Internal Server Error"})
}
})

router.post('/shuthiber/:pcid', fetchuser, async (req,res)=>
{
    try{
        const userId= req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        const {url, task} = req.body
        if(!thisDevice)
            return res.status(404).json({"status": "failed", "error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"status": "failed", "error": "This PC belongs to another user"})
 
        const token= req.headers['auth-token']
        const options={
            method: 'GET',
            headers:{
                "Content-Type": "application/json",
                "auth-token": token,  
            }
        }

        let ress= await fetch(url+'/api/'+task, options)
        ress= await ress.json()
      
        res.status(200).json(ress)
    }
    catch(err){
        console.log('error in trial' , err)
        res.status(400).json({"status": "failed", "error": "Internal Server Error"})
    }
})

router.post('/taskkill/:pcid', fetchuser, async (req,res)=>
{
    try{
        const userId= req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        const {url, task} = req.body
        if(!thisDevice)
            return res.status(404).json({"status": "failed", "error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"status": "failed", "error": "This PC belongs to another user"})
 
        const token= req.headers['auth-token']
        const options={
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "auth-token": token,  
            },
            body: JSON.stringify({task: task})
        }

        let ress= await fetch(url+'/api/taskkill', options)
        ress= await ress.json()
        res.status(200).json(ress)
    }
    catch(err){
        console.log('error in trial' , err)
        res.status(400).json({"status": "failed", "error": "Internal Server Error"})
    }
})

router.post('/battery/:pcid', fetchuser, async (req,res)=>
{
    try{
        const userId= req.userId
        const thisDevice= await Devices.findOne({_id: req.params.pcid})
        const {url} = req.body
        if(!thisDevice)
            return res.status(404).json({"status": "failed", "error": "Device Not Found"})
        
        if(thisDevice.userId!= userId)
            return res.status(401).json({"status": "failed", "error": "This PC belongs to another user"})
        const token= req.headers['auth-token']
        const options={
            method: 'GET',
            headers:{
                "Content-Type": "application/json",
                "auth-token": token,  
            }
        }
        let ress= await fetch(url+'/api/batteryinfo', options)
        ress= await ress.json()
        res.status(200).json(ress)
    }
    catch(err){
        console.log('error in trial' , err)
        res.status(400).json({"status": "failed", "error": "Internal Server Error"})
    }
})

module.exports=router