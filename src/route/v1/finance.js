'use strict'

const express = require('express')
const router = express.Router()
const Expense = require('../../model/expense')

router.get('/expenses', async (req, res) => {
    const expenses = await Expense.find()

    res.json(expenses)
})

router.get('/expenses/:id', async (req, res) => {
    const expense = await Expense.find({ id: req.params.id })

    res.json(expense)
})

router.post('/expenses', async (req, res) => {
    if(!req.body.id || !req.body.title || !req.body.value || !req.body.date) {
        res.status(500).json({
            message: 'Malformed body',
            error: {
                status: 500
            }
        })
    } else {
        let e = new Expense(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/expenses', async (req, res) => {
    if(!req.body.id && !req.body.title && !req.body.value && !req.body.date) {
        res.status(500).json({
            message: 'Malformed body',
            error: {
                status: 500
            }
        })
    } else {
        await Expense.update({ id: req.body.id }, { $set: req.body })
        
        const expense = await Expense.find({ id: req.body.id })

        res.json(expense)
    }
})

router.delete('/expenses/:id', async (req, res) => {
    await Expense.remove({ id: req.params.id })

    res.json({
        message: 'Expense deleted',
        success: {
            status: 200
        }
    })
})

module.exports = router