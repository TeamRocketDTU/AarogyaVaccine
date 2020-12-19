const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Admin = require('../../models/Admin')
const config = require('config');

route = Router()

route.post('/',[
    check('username',"Field is Required").not().isEmpty(),
    check('password',"Field is Required").not().isEmpty(),
],async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        username,
        password
    } = req.body;

    try{
        let admin =  await Admin.findOne({username})
        if(admin){
            return res.status(400).json({errors:[{msg: 'Admin already exist!!!'}]})
        }

        admin = new Admin({
            username,
            password
        })

        const salt = await bcrypt.genSalt(10)
        admin.password = await bcrypt.hash(password,salt)

        //saving a user
        await admin.save()

        const payload = {
            admin:{
                id: admin.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:3600000},(err,token)=>{
            if(err) {
                throw err
            }
            return res.json({token})
        })
    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

route.post('/login',[
    check('username',"Field is Required").not().isEmpty(),
    check('password',"Field is Required").not().isEmpty(),
],async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {
        username,
        password
    } = req.body;

    try{
        let admin =  await Admin.findOne({username})
        if(admin){
            return res.status(400).json({errors:[{msg: 'Admin not found!!!'}]})
        }

        const isMatch = await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.status(400).json({errors:[{msg: 'Invalid credentials'}]})
        }

        const payload = {
            admin:{
                id: admin.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:3600000},(err,token)=>{
            if(err) {
                throw err
            }
            return res.json({token})
        })

    }catch (err) {
        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})

module.exports = { route }