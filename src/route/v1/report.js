'use strict'

const express = require('express')
const router = express.Router()

//const Plane = require('../../model/report')

router.get('/report', (req, res) => {
    res.json({teste:'ok'})
})

module.exports = router