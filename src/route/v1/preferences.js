'use strict'

const express = require('express')
const router = express.Router()
const Preferences = require('../../model/preferences')

router.get('/preferences/:id', async (req, res) => {
    const preferences = await Preferences.findOne({ userId: req.params.id })

    if(preferences) {
        res.json(preferences)
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.post('/preferences', async (req, res) => {
    if(!req.body.userId) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const preferences = await Preferences.findOne({ userId: req.body.userId })

        if(preferences) {
            res.status(500).json({
                message: 'Id already exists'
            })
        } else {
            let p = new Preferences({
                userId: req.body.userId,
                notificationIncome: false,
                notificationShifts: false,
                goalValue: 0,
                goalActive: false
            })

            await p.save()

            res.json(p)
        }
    }
})

router.put('/preferences/:id', async (req, res) => {
    if(!req.body.notificationIncome && !req.body.notificationShifts && !req.body.goalActive && !req.body.goalValue) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Preferences.update({ userId: req.params.id }, { $set: req.body })
        
        if(result.n > 0) {
            const preferences = await Preferences.findOne({ userId: req.params.id })

            res.json(preferences)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

module.exports = router