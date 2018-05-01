const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const debug = require('debug')
const crypto = require('crypto')
const SparkPost = require('sparkpost')
const admin = require('firebase-admin')
const client = new SparkPost('aa1f1c693c80bde84af4cac8a49a53f4b0aa5fc0')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let confSchema = new Schema({
    email: String,
    timestamp: String,
    code: String,
    confirmed: Boolean
})

let Confirmation = mongoose.model('Confirmation', confSchema)

router.get('/terms', (req, res) => {
    const file = path.join(__dirname, '../../../assets/docs', 'terms.pdf')
    const stream = fs.createReadStream(file)
    var stat = fs.statSync(file)
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', 'application/pdf')

    if(req.headers['user-agent'].indexOf('iOS') > -1 || req.headers['user-agent'].indexOf('Android') > -1) {
        res.setHeader('Content-Disposition', 'attachment; filename=terms.pdf')
    } else {
        res.setHeader('Content-Disposition', 'filename=terms.pdf')
    }

    stream.pipe(res)
})

router.get('/confirm', async (req, res) => {
    if(!req.query.code) {
        res.status(301).redirect('https://www.plandoc.com.br')
    } else {
        const result = await Confirmation.update({ $and: [  
            { code: req.query.code }, 
            { confirmed: false } ] 
        }, 
        { $set: { confirmed: true } })

        const c = await Confirmation.findOne({ code: req.query.code })

        if(c.confirmed) {
            const user = await admin.auth().getUserByEmail(result.email)

            await admin.auth().updateUser(user.uid, {
                emailVerified: true
            })

            res.setHeader('Content-Type', 'text/html')
            res.status(200)
                .send(`<html>
                            <head>
                                <title>Plandoc | Email Confirmado</title>
                            </head>
                        <body>
                            <h1>Seu email foi confirmado :)</h1>

                            <p><a href="http://www.plandoc.com.br">Voltar para Plandoc</a></p>
                        </body>
                    </html>`)
        } else {
            res.status(301).redirect('https://www.plandoc.com.br')
        }
    }
})

router.post('/confirm', async (req, res) => {
    const body = req.body
    const now = Date.now()
    
    const source = body.email + now

    const secret = 'pdc-api';
    const code = crypto.createHmac('sha256', secret)
                   .update(source)
                   .digest('hex')

    let confirmation = new Confirmation({
        email: body.email,
        timestamp: now,
        code: code,
        confirmed: false
    })

    const result = await Confirmation.findOne({ email: body.email })

    if(result) {
        await Confirmation.update({ email: body.email, code: code }, { $set: { code: code } })
    } else {
        await confirmation.save()
    }

    client.transmissions.send({
        content: {
            from: 'Suporte Plandoc <suporte@plandoc.com.br>',
            subject: 'Plandoc | Confirme seu email',
            html:`<html>
                    <body>
                      <p>Olá, ${body.name} e bem vindo à Plandoc :)</p></br>
                      <p>Vimos aqui que você fez um cadastro e gostaríamos de te agradecer pela preferência.</p></br>Para completar o cadastro, por favor clique <a href="http://api.plandoc.com.br/v1/confirm?code=${code}">aqui</a> para confirmar seu email.</p></br>
                      <p>Obrigado</p><p><b>Equipe Plandoc</b></p>
                    </body>
                  </html>`
        },
        recipients: [
          {address: body.email}
        ]
      })
      .then(data => {
        res.status(200)
            .json({
                message: 'OK'
            })
      })
      .catch(err => {
        res.status(500)
            .json({
                message: err.message
            })
      })
})

module.exports = router