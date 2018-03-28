'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const SparkPost = require('sparkpost')
const client = new SparkPost('aa1f1c693c80bde84af4cac8a49a53f4b0aa5fc0')

const debug = require('debug')('pdc:server')

let fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../../assets/fonts', '/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../../../assets/fonts', '/Roboto-Bold.ttf')
    }
}

let PdfPrinter = require('pdfmake/src/printer')
let printer = new PdfPrinter(fonts)

router.post('/report', (req, res) => {
    let body = req.body

    debug(JSON.stringify(body))

    let table = [
        [ 
            { text: 'Local do Plantão', bold: true }, 
            { text: 'Data de Entrada', bold: true }, 
            { text: 'Data de Saída', bold: true }, 
            { text: 'Horas', bold: true }, 
            { text: 'Valor', bold: true } 
        ]
    ]

    let footer = [
        [ 
            { text: 'Total', bold: true },
            { text: body.hours, alignment: 'right', bold: true },
            { text: body.total, alignment: 'right', bold: true }
        ]
    ]

    body.data.forEach(line => {
        line[3] = { text: line[3], alignment: 'right' }
        line[4] = { text: line[4], alignment: 'right' }

        table.push(line)
    })

    let dd = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [ 40, 60, 40, 60 ],
        content: [
            { text: 'Resumo de Plantões', alignment: 'center', bold: true, fontSize: 22 },
            { text: body.name, bold: true },
            `Período: ${body.startDate} a ${body.endDate}`,
            {
                table: {
                  headerRows: 1,
                  widths: [ '*', '*', '*', 60, 120 ],
                  body: table
                }
            },
            {
                table: {
                    widths: [ '*', 60, 120 ],
                    body: footer
                }
            }
        ]
    }

    let chunks = []
  
    let doc = printer.createPdfKitDocument(dd)

    doc.on('data', chunk => {
        chunks.push(chunk)
    })

    doc.on('end', () => {
        let result = Buffer.concat(chunks)
        let encoded = result.toString('base64')

        debug(encoded)

        if(body.send) {
            send(body, encoded)
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="response.pdf"'
        })

        res.end(result)
    })

    doc.end()
})

function send(body, encoded) {
    client.transmissions.send({
        content: {
            from: 'suporte@plandoc.com.br',
            subject: `Plandoc | Relatório do período ${body.startDate} a ${body.endDate}`,
            html:`<html>
                    <body>
                      <p>Olá, ${body.name}</p>
                      <p>Segue em anexo o relatório gerado.</p>
                      <p>Obrigado!</p>
                    </body>
                  </html>`,
            attachments: [
                {
                    type: 'application/pdf',
                    name: 'report.pdf',
                    data: encoded
                }
            ]
        },
        recipients: [
          {address: body.email}
        ]
      })
      .then(data => {
        debug(data)
      })
      .catch(err => {
        debug(err)
      })
}

module.exports = router