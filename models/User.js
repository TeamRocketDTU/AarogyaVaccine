const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    uid:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    alternativemobileNumber:{
        type: Number
    },
    commute:{
        type: Boolean,
        required: true
    },
    frontlineWorker:{
        type: Boolean,
        required: true
    },
    sysID:{
        type: String,
    },
    facilityID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'facility'
    },
    slotTime:{
        type: Number
    },
    vaccinatedFirstTime:{
        type: Boolean,
        default: false
    },
    vaccinatedSecondTime:{
        type: Boolean,
        default: false
    }
})

module.exports = User = mongoose.model('user',UserSchema)