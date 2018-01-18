'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

var v1 = new Array()

fs.readdirSync(path.join(__dirname, 'v1')).forEach(file => {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        v1.push(require('./v1/' + file))
    }
})

router.use('/v1', v1)

module.exports = router