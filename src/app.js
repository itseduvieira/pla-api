'use strict'

const express = require('express')
const app = express()
const logger = require('morgan')
const debug = require('debug')('pdc:server')
const bodyParser = require('body-parser')
const config = require('../config/constants')
const admin = require('firebase-admin')
const serviceAccount = require('../config/serviceAccountKey.json')

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: config.firebase.database
})

app.use(logger('dev'))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }))

const api = require('./route/api')

// app.use('/api', [logIncomingRequest, passport.authenticate('jwt', { session: false })], api)

const logIncomingRequest = (req, res, next) => {
    if (app.get('env') === 'development') {
        console.log('HEADER ' + JSON.stringify(req.headers) + 
            (req.method !== 'GET' ? '\nBODY ' + JSON.stringify(req.body) : ''))
    }

    next()
}

const basicAuth = (req, res, next) => {
    const auth = req.headers["authorization"]
    const parts = auth.split(' ')

    //TODO: Remove report after app update
    if(!auth && parts[0] !== 'Bearer' && req.url !== '/confirm' && req.url !== '/v1/report') {
        res.status(401).json({
            message: "Unauthorized"
        })
    } else {
        res.locals.userId = parts[1]

        next()
    }
}

app.use('/', [logIncomingRequest, basicAuth], api)

app.use((req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({nope: true})
    } else {
        next()
    }
})

app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    
    let msg = {
        message: err.message,
        error: err
    }

    debug('ERR: ' + err.message)
    res.json(msg)
})

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const connection = mongoose.connect(config.database.url, {
    useMongoClient: true
}).then(() => { 
    debug('MongoDB connected')
}).catch(err => {
    debug('ERR: ' + JSON.stringify(err))
})

module.exports = app
