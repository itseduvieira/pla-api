'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Profile = new Schema({
    userId: String,
    notificationIncome: Boolean,
    notificationShifts: Boolean,
    goalValue: Number,
    goalActive: Boolean
})

module.exports = mongoose.model('Profile', Profile)