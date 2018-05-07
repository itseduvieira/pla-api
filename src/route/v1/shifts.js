'use strict'

const express = require('express')
const router = express.Router()
const Shift = require('../../model/shift')

router.get('/shifts', async (req, res) => {
    const shifts = await Shift.find()

    res.json(shifts)
})

router.get('/shifts/:id', async (req, res) => {
    const shift = await Shift.findOne({ id: req.params.id })

    if(shift) {
        res.json(shift)
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.post('/shifts', async (req, res) => {
    if(!req.body.id || !req.body.title || !req.body.value || !req.body.date) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        let e = new Shift(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/shifts/:id', async (req, res) => {
    if(!req.body.title && !req.body.value && !req.body.date) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Shift.update({ id: req.params.id }, { $set: req.body })
        
        if(result.n > 0) {
            const shift = await Shift.findOne({ id: req.params.id })

            res.json(shift)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

router.delete('/shifts/:id', async (req, res) => {
    const data = await Shift.remove({ id: req.params.id })

    if(data.result.n > 0) {
        res.json({
            message: 'Shift deleted'
        })
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

module.exports = router