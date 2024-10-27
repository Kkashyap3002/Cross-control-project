const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
    deviceName:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required:true
    },
    userId:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Devices', deviceSchema)