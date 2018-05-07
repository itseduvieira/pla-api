'use strict'

const express = require('express')
const router = express.Router()
const Company = require('../../model/company')

router.get('/companies', async (req, res) => {
    const companies = await Company.find()

    res.json(companies)
})

router.get('/companies/:id', async (req, res) => {
    const company = await Company.findOne({ id: req.params.id })

    if(company) {
        res.json(company)
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

router.post('/companies', async (req, res) => {
    if(!req.body.id || !req.body.type || !req.body.name || !req.body.place || !req.body.color) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        let e = new Company(req.body)

        await e.save()

        res.json(e)
    }
})

router.put('/companies/:id', async (req, res) => {
    if(!req.body.type && !req.body.name && !req.body.place && !req.body.admin && !req.body.adminPhone && !req.body.color) {
        res.status(500).json({
            message: 'Malformed body'
        })
    } else {
        const result = await Company.update({ id: req.params.id }, { $set: req.body })
        
        if(result.n > 0) {
            const company = await Company.findOne({ id: req.params.id })

            res.json(company)
        } else {
            res.status(404).json({
                message: 'Id not found'
            })
        }
    }
})

router.delete('/companies/:id', async (req, res) => {
    const data = await Company.remove({ id: req.params.id })

    if(data.result.n > 0) {
        res.json({
            message: 'Company deleted'
        })
    } else {
        res.status(404).json({
            message: 'Id not found'
        })
    }
})

module.exports = router