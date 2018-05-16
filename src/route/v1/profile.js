'use strict'

const express = require('express')
const router = express.Router()
const Profile = require('../../model/profile')

router.get('/profile', async (req, res) => {
    let profile = await Profile.findOne({ id: res.locals.userId })

    profile = profile || { }

    res.json(profile)
})

module.exports = router