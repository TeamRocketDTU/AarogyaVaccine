const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const Facility = require('../../models/Facility')
// const {getRandomString} = require('../../middleware/SystemID')
const config = require('config');

route = Router()

// Queueing Patients
route.post('/',[
    check('name',"Field is Required").not().isEmpty(),
    check('uid',"Field is Required").not().isEmpty(),
    check('pincode',"Field is Required").not().isEmpty(),
    check('age',"Field is Required").not().isEmpty(),
    check('commute',"Field is Required").not().isEmpty()
],async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        name,
        address,
        pincode,
        uid,
        age,
        gender,
        mobileNumber,
        alternativemobileNumber,
        commute,
        frontlineWorker
    } = req.body;

    try{
        let user =  await User.findOne({uid})
        if(user){
            return res.status(400).json({errors:[{msg: 'User already exist!!!'}]})
        }
        // No use of checking as of now
        // if(user.vaccinated){
        //     return res.status(400).json({errors:[{msg: 'User already vaccinated!!!'}]})
        // }

        user = new User({
            name,
            address,
            pincode,
            uid,
            age,
            gender,
            mobileNumber,
            alternativemobileNumber,
            commute,
            frontlineWorker
        })

        const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let buff = []
        while (buff.length < 6) {
            const charCode = parseInt(Math.random() * (36))
            buff.push(ALPHANUMERIC.charAt(charCode))
        }
        user.sysID = buff.join('');

        let facID = (pincode % 100);
        let facility = await Facility.findOne({facID:facID.toString()})
        if(facility.slots.length === 0){
            return res.status(404).json({errors:[{msg: 'No avaliability of slots Today.'}]})
        }

        facility.slots.pop()

        user.facilityID = facility.id;
        user.slotTime = 8 + ((16 - facility.slots.length)/2)
        user.vaccinated = false

        //saving a user
        await user.save()
        await facility.save()
        return res.send("success")
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }