'use strict'

const express = require('express')
const router = express.Router()
const Preferences = require('../../model/preferences')

router.get('/preferences', async (req, res) => {
    const preferences = await Preferences.findOne({ userId: res.locals.userId })

    setTimeout(() => {
        if(preferences) {
            res.json(preferences)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }, 10000)

    
})

router.post('/preferences', async (req, res) => {
    const preferences = await Preferences.findOne({ userId: res.locals.userId })

    if(preferences) {
        res.status(500).json({
            message: 'Id already exists'
        })
    } else {
        let p = new Preferences({
            userId: res.locals.userId,
            notificationIncome: false,
            notificationShifts: false,
            goalValue: 0,
            goalActive: false,
            online: false
        })

        await p.save()

        res.json(p)
    }
})

router.put('/preferences', async (req, res) => {
    if(!req.body.notificationIncome && !req.body.notificationShifts && !req.body.goalActive && !req.body.goalValue && !req.body.online) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Preferences.update({ userId: res.locals.userId }, { $set: req.body })
        
        if(result.n > 0) {
            const preferences = await Preferences.findOne({ userId: res.locals.userId })

            res.json(preferences)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

module.exports = router