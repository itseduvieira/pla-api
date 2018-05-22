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
    if(!req.body.id || !req.body.companyId || !req.body.date || !req.body.paymentType || 
        !req.body.shiftTime || !req.body.paymentDueDate || !req.body.salary) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        let body = req.body

        body.paid = false

        let s = new Shift(body)

        await s.save()

        res.json(s)
    }
})

router.put('/shifts/:id', async (req, res) => {
    if(!req.body.companyId && !req.body.date && !req.body.paymentType && 
        !req.body.shiftTime && !req.body.paymentDueDate && !req.body.salary && 
        !req.body.paid) {
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