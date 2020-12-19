const { Router } = require('express');

const UserRoute = require('./patient').route
const FacilityRoute = require('./facilities').route

const route = Router()

// route.get('/',(req,res)=>{
//     res.send("Hello");
// })

route.use('/users',UserRoute)
route.use('/facility',FacilityRoute)

module.exports = { route };