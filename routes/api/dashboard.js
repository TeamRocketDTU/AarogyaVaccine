const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Facility = require('../../models/Facility')
const config = require('config');

route = Router()

route.get('/',async (req, res) => {
    try{
        let centres = await Facility.find()
        if(!centres){
            return res.status(400).json({msg: 'No Centres Found.'})
        }

        return res.json(centres)
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

route.post('/reset',auth, async (req, res) => {
    try{
        let centres = await Facility.find()
        if(!centres){
            return res.status(400).json({msg: 'No Centres Found.'})
        }
        centres.forEach(async (centre)=>{
            let temp = await Facility.findOne({facID:centre.facID})
            temp.slots = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
            await temp.save()
        })
        return res.json(centres)
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }