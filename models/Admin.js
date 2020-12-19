const mongoose = require('mongoose')

//Describing the Admin
const AdminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = Admin = mongoose.model('admin', AdminSchema)