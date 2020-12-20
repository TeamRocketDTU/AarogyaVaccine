const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const Facility = require('../../models/Facility')
// const {getRandomString} = require('../../middleware/SystemID')
const config = require('config');
const Nexmo = require('nexmo');

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
        user.slotTime = Date.now()
        user.finalTime = user.slotTime + 2*60*60*1000

        let facID = pincode*100 ;
        let facility = await Facility.findOne({facID:facID.toString()})
        if(facility.slots.length === 0){
            return res.status(404).json({errors:[{msg: 'No avaliability of slots Today.'}]})
        }

        facility.slots.pop()
        facility.occupants.unshift({
            name:user.name,
            sysID:user.sysID,
            age:user.age,
            gender:user.gender,
            commute:user.commute,
            slotTime:user.slotTime,
            finalTime:user.finalTime
        })

        user.facilityID = facility.id;
        user.slotTime = 8 + ((16 - facility.slots.length)/2)
        user.vaccinated = false

        const nexmo = new Nexmo({
            apiKey: '6d98a926',
            apiSecret: 'BMzU48znjh6FeaDv',
        });

        const from = 'Rocket Vaccine';
        const to = user.mobileNumber.toString();
        const text = `Appointment booked for vaccine at ${facility.address} from ${user.slotTime} to ${user.finalTime}`;

        nexmo.message.sendSms(from, to, text);

        //saving a user
        await user.save()
        await facility.save()
        return res.send("success")
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

route.post('/:uid/vaccinated', async (req,res)=>{
    try {
        let patient = await User.findOne({uid:req.params.uid})
        if(!patient){
            return res.status(404).json({errors:[{msg: 'No such User Found'}]})
        }
        patient.vaccinated = true
        await patient.save()
        return res.status(200).send("Succesfully Vaccinated")
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

route.post('/:uid/vaccinated/cancel', async (req,res)=>{
    try {
        let patient = await User.findOne({uid:req.params.uid})
        if(!patient){
            return res.status(404).json({errors:[{msg: 'No such User Found'}]})
        }
        patient.vaccinated = false
        await patient.save()
        return res.status(200).send("Vaccinated Failed")
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }