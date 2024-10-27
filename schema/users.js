const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String
    },
    pwd:{
        type: String,
        required:true
    },
    userSecret:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Users', userSchema)