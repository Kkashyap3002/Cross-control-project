const mongoose = require('mongoose')

const connectToDb = (connectionString) => {
    mongoose.set('strictQuery', false)
    mongoose.connect(connectionString)
    //console.log('connected to database')
}

module.exports = connectToDb