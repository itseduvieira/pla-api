'use strict'

const express = require('express')
const router = express.Router()
const Profile = require('../../model/profile')

router.get('/profile/:id', async (req, res) => {
    const profile = await Profile.findOne({ userId: req.params.id })

    if(profile) {
        res.json(profile)
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.post('/profile', async (req, res) => {
    if(!req.body.userId) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const profile = await Profile.findOne({ userId: req.body.userId })

        if(profile) {
            res.status(500).json({
                message: 'Id already exists'
            })
        } else {
            let p = new Profile({
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

router.put('/profile/:id', async (req, res) => {
    if(!req.body.notificationIncome && !req.body.notificationShifts && !req.body.goalActive && !req.body.goalValue) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Profile.update({ userId: req.params.id }, { $set: req.body })
        
        if(result.n > 0) {
            const profile = await Profile.findOne({ userId: req.params.id })

            res.json(profile)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

module.exports = router