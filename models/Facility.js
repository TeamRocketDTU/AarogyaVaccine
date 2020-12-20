const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FacilitySchema = new Schema({
    facID:{
        type: String,
        required: true,
        unique: true
    },
    facilityName:{
        type: String
    },
    facilityAddress:{
        type: String
    },
    slots:{
        type: [Number]
    },
    maxCapacity:{
        type: Number,
        required: true,
        default: 16
    },
    occupants:[
        {
            name:{
                type: String,
            },
            sysID:{
                type: String,
            },
            age:{
                type: Number,
                required: true
            },
            gender:{
                type: String,
                required: true
            },
            commute:{
                type: Boolean,
                required: true
            },
            slotTime:{
                type: Number
            },
            finalTime:{
                type: Number
            }
        }
    ]
})

module.exports = Facility = mongoose.model('facility',FacilitySchema)