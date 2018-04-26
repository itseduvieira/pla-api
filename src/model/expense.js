'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Expense = new Schema({
    groupId: String,
    id: String,
    title: String,
    value: Number,
    date: Date
})

module.exports = mongoose.model('Expense', Expense)