'use strict'

const express = require('express')
const router = express.Router()
const Shift = require('../../model/shift')

router.get('/shifts', async (req, res) => {
    const shifts = await Shift.find()

    res.json(shifts)
})

router.get('/shifts/:id', async (req, res) => {
    const shift = await Shift.find({ id: req.params.id })

    res.json(shift)
})

router.post('/shifts', async (req, res) => {
    if(!req.body.id || !req.body.title || !req.body.value || !req.body.date) {
        res.status(500).json({
            message: 'Malformed body',
            error: {
                status: 500
            }
        })
    } else {
        let e = new Shift(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/shifts', async (req, res) => {
    if(!req.body.id && !req.body.title && !req.body.value && !req.body.date) {
        res.status(500).json({
            message: 'Malformed body',
            error: {
                status: 500
            }
        })
    } else {
        await Shift.update({ id: req.body.id }, { $set: req.body })
        
        const shift = await Shift.find({ id: req.body.id })

        res.json(shift)
    }
})

router.delete('/shifts/:id', async (req, res) => {
    await Shift.remove({ id: req.params.id })

    res.json({
        message: 'Shift deleted',
        success: {
            status: 200
        }
    })
})

module.exports = router