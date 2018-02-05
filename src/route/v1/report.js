'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

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

    console.log(JSON.stringify(body))

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
    
    res.header("Content-Type", "application/pdf")
    let doc = printer.createPdfKitDocument(dd)
    doc.pipe(res)
    doc.end()
})

function send() {
    //sparkpost
    //aa1f1c693c80bde84af4cac8a49a53f4b0aa5fc0
    // curl -X POST \
    // https://api.sparkpost.com/api/v1/transmissions \
    // -H "Authorization: aa1f1c693c80bde84af4cac8a49a53f4b0aa5fc0" \
    // -H "Content-Type: application/json" \
    // -d '{
    //     "options": {
    //     "sandbox": true
    //     },
    //     "content": {
    //     "from": "sandbox@sparkpostbox.com",
    //     "subject": "Thundercats are GO!!!",
    //     "text": "Sword of Omens, give me sight BEYOND sight"
    //     },
    //     "recipients": [{ "address": "suporte@plandoc.com.br" }]
    // }'
}

module.exports = router