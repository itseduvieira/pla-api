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

router.get('/report', (req, res) => {
    let dd = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [ 40, 60, 40, 60 ],
        content: [
            'Eduardo Vieira',
            'Período: 01/01/2017 a 31/01/2017',
            {
                table: {
                  headerRows: 1,
                  widths: [ '*', '*', '*', '*', '*' ],
                  body: [
                    [ { text: 'Local do Plantão', bold: true }, { text: 'Data de Entrada', bold: true }, { text: 'Data de Saída', bold: true }, { text: 'Total', bold: true }, { text: 'Valor', bold: true } ],
                    [ 'Santa Casa  (São Paulo)', '23/01/2017 22:00', '24/01/2017 00:00', '2', 'R$1.000,00' ],
                    [ 'Clínica Oftalmo', '23/01/2017 21:00', '24/01/2017 02:00', '5', 'R$5.000,00' ],
                    [ 'Santa Casa  (Santos)', '23/01/2017 22:00', '24/01/2017 00:00', '2', 'R$5.000,00' ]
                  ]
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