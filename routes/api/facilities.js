const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const Facility = require('../../models/Facility')
const config = require('config');

route = Router()

// Adding Facilities
route.post('/',[
    check('facID',"Field is Required").not().isEmpty(),
    check('facilityName',"Field is Required").not().isEmpty(),
],async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        facID,
        facilityName
    } = req.body;

    slots = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

    try{
        let fac = new Facility ({
            facID,
            facilityName,
            slots
        })
        await fac.save()
        return res.send("success")
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

// Serves JSON
route.get('/:id',async (req,res)=>{
    try {
        let facility = await Facility.findOne({facID:req.params.id})
        let obj = {
            date: Date.now(),
            centreID: facility.facID,
            number: 16 - facility.slots.length,
            patients: facility.occupants
        }
        return res.status(200).json({obj})
    } catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }