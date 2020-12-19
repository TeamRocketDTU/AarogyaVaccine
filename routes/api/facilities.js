const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const Facility = require('../../models/Facility')
const config = require('config');

route = Router()

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
        facilityName,
        slots
    } = req.body;

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

module.exports = { route }