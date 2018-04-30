'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Shift = new Schema({
    userId: String,
    id: String,
    groupId: String,
    companyId: String,
    date: Date,
    paymentType: String,
    shiftTime: Number,
    paymentDueDate: Date,
    salary: Number,
    paid: Boolean
})

module.exports = mongoose.model('Shift', Shift)