const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const debug = require('debug')
const SparkPost = require('sparkpost')
const client = new SparkPost('aa1f1c693c80bde84af4cac8a49a53f4b0aa5fc0')

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

router.post('/confirm', (req, res) => {
    let body = req.body

    debug(JSON.stringify(body))

    client.transmissions.send({
        content: {
            from: 'Suporte Plandoc <suporte@plandoc.com.br>',
            subject: 'Plandoc | Confirme seu email',
            html:`<html>
                    <body>
                      <p>Olá, ${body.name} e bem vindo à Plandoc :)</p></br></br>
                      <p>Vimos aqui que você fez um cadastro e gostaríamos de te agradecer pela preferência.</p></br></br>Para completar o cadastro, por favor <a href="#">neste link</a> para confirmar seu email.</p></br></br>
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
                error: true,
                message: err.message
            })
      })
})

module.exports = router