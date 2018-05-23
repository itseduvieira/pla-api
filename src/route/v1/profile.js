'use strict'

const express = require('express')
const router = express.Router()
const Profile = require('../../model/profile')

router.get('/profile', async (req, res) => {
    let profile = await Profile.findOne({ id: res.locals.userId })

    profile = profile || { }

    res.json(profile)
})

router.post('/profile', async (req, res) => {
    if(!req.body.crm || !req.body.uf || !req.body.graduationDate || 
        !req.body.institution || !req.body.field) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        req.body.userId = res.locals.userId
        
        let e = new Profile(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/profile', async (req, res) => {
    if(!req.body.crm || !req.body.uf || !req.body.graduationDate || 
        !req.body.institution || !req.body.field) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Profile.update({ userId: res.locals.userId }, { $set: req.body })
        
        if(result.n > 0) {
            const profile = await Profile.findOne({ userId: res.locals.userId })

            res.json(profile)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

module.exports = router