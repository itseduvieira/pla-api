'use strict'

const express = require('express')
const router = express.Router()
const Expense = require('../../model/expense')

router.get('/expenses', async (req, res) => {
    const expenses = await Expense.find({ userId: res.locals.userId })

    res.json(expenses)
})

router.get('/expenses/:id', async (req, res) => {
    const expense = await Expense.findOne({ $and: [  
        { id: req.params.id }, 
        { userId: res.locals.userId } ]
    })

    if(expense) {
        res.json(expense)
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.post('/expenses', async (req, res) => {
    if(!req.body.id || !req.body.title || !req.body.value || !req.body.date) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        req.body.userId = res.locals.userId

        let e = new Expense(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/expenses/:id', async (req, res) => {
    if(!req.body.title && !req.body.value && !req.body.date) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Expense.update({ $and: [  
            { id: req.params.id }, 
            { userId: res.locals.userId } ]
        }, { $set: req.body })
        
        if(result.n > 0) {
            const expense = await Expense.findOne({ $and: [  
                { id: req.params.id }, 
                { userId: res.locals.userId } ]
            })

            res.json(expense)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

router.delete('/expenses/:id', async (req, res) => {
    const data = await Expense.remove({ $and: [  
        { id: req.params.id }, 
        { userId: res.locals.userId } ]
    })

    if(data.result.n > 0) {
        res.json({
            message: 'Expense deleted'
        })
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.delete('/expenses/group/:groupId', async (req, res) => {
    const data = await Expense.remove({ $and: [  
        { groupId: req.params.groupId }, 
        { userId: res.locals.userId } ]
    })

    if(data.result.n > 0) {
        res.json({
            message: 'Expense deleted'
        })
    } else {
        res.status(404).json({
            message: 'GroupId not found'
        })
    }
})

module.exports = router