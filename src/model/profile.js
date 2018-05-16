'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Profile = new Schema({
    userId: String,
    crm: String,
    uf: String,
    graduationDate: String,
    institution: String,
    field: String
})

module.exports = mongoose.model('Profile', Profile)