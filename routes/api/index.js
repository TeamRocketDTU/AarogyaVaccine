const { Router } = require('express');

const UserRoute = require('./patient').route
const FacilityRoute = require('./facilities').route
const DashboardRoute = require('./dashboard').route
const AdminRoute = require('./admin').route

const route = Router()

// route.get('/',(req,res)=>{
//     res.send("Hello");
// })

route.use('/users',UserRoute)
route.use('/facility',FacilityRoute)
route.use('/dashboard',DashboardRoute)
route.use('/admin',AdminRoute)

module.exports = { route };