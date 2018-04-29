'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Company = new Schema({
    id: String,
    type: String,
    name: String,
    place: String,
    admin: String,
    adminPhone: String,
    color: String
})

module.exports = mongoose.model('Company', Company)