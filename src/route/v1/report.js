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
        [ { text: 'Local do Plantão', bold: true }, { text: 'Data de Entrada', bold: true }, { text: 'Data de Saída', bold: true }, { text: 'Total', bold: true }, { text: 'Valor', bold: true } ]
    ]

    body.data.forEach(line => {
        table.push(line)
    })

    let dd = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [ 40, 60, 40, 60 ],
        content: [
            body.name,
            `Período: ${body.startDate} a ${body.endDate}`,
            {
                table: {
                  headerRows: 1,
                  widths: [ '*', '*', '*', '*', '*' ],
                  body: table
                }
            }
        ]
    }
    
    res.header("Content-Type", "application/pdf")
    let doc = printer.createPdfKitDocument(dd)
    doc.pipe(res)
    doc.end()
})

module.exports = router