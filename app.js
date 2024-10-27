const express= require('express')
const connectToDb=require('./db')
const auth=require('./routes/auth')
const fetch = require('node-fetch')
const devices = require('./routes/device')
require('dotenv').config()
const port= 3000;
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Backend')
})

app.use('/api/auth', auth)
app.use('/api/devices', devices)

const start = async () =>{
    try {
        await connectToDb(process.env.MONGO_URI)
        app.listen(port, console.log( `Listening on PORT ${port} `))
    } catch (error) {
        console.log(err)
    }
}

start()