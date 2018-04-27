'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let Preferences = new Schema({
    groupId: String,
    id: String,
    title: String,
    value: Number,
    date: Date
})

module.exports = mongoose.model('Preferences', Preferences)