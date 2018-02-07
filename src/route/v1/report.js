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
            { text: 'Total', bold: true }, 
            { text: 'Valor', bold: true } 
        ]
    ]

    let footer = [
        [ 
            { text: 'Total', bold: true },
            { text: body.total, bold: true }
        ]
    ]

    body.data.forEach(line => {
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
                  widths: [ '*', '*', '*', '*', '*' ],
                  body: table
                }
            },
            {
                table: {
                    widths: [ '*', '*'],
                    body: footer
                }
            }
        ]
    }
    
    
    /*
    
    if(body.send) {
        doc.getBase64(function(encodedString) {
            send(body, encodedString)
        })
    }
    
    doc.pipe(res)
    doc.end()*/


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
            html:`<html><body><p>Olá, ${body.name}</p><p>Segue em anexo o relatório gerado.</p><p>Obrigado!</p></body></html>`,
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
        debug('Woohoo! You just sent your first mailing!')
        debug(data)
      })
      .catch(err => {
        debug('Whoops! Something went wrong')
        debug(err)
      })
}

module.exports = router