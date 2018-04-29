'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Shift = new Schema({
    id: String
})

module.exports = mongoose.model('Shift', Shift)