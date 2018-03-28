const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

router.get('/terms', (req, res) => {
    const file = path.join(__dirname, '../../../assets/docs', 'terms.pdf')
    const stream = fs.createReadStream(file)
    var stat = fs.statSync(file)
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=terms.pdf')

    stream.pipe(res)
})

router.post('/confirm', (req, res) => {
    let body = req.body

    debug(JSON.stringify(body))

    client.transmissions.send({
        content: {
            from: 'suporte@plandoc.com.br',
            subject: `Plandoc | Confirme seu email`,
            html:`<html>
                    <body>
                      <p>Olá, ${body.name}</p>
                      <p>Segue em anexo o relatório gerado.</p>
                      <p>Obrigado!</p>
                    </body>
                  </html>`
        },
        recipients: [
          {address: body.email}
        ]
      })
      .then(data => {
        debug(data)

        res.status(200)
            .json(JSON.stringify({
                message: 'OK'
            }))
      })
      .catch(err => {
        debug(err)

        res.status(500)
            .json(JSON.stringify(err))
      })
})

module.exports = router