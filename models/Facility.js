const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FacilitySchema = new Schema({
    facilityID:{
        type: String,
        required: true
    },
    facilityName:{
        type: String
    },
    slots:{
        type: [Number]
    },
    maxCapacity:{
        type: Number,
        required: true,
        default: 25
    }
})

module.exports = Facility = mongoose.model('facility',FacilitySchema)