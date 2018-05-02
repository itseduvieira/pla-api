'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Preferences = new Schema({
    userId: String,
    notificationIncome: Boolean,
    notificationShifts: Boolean,
    goalValue: Number,
    goalActive: Boolean
})

module.exports = mongoose.model('Preferences', Preferences)