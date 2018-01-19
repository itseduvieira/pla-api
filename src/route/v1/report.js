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
            'First paragraph',
            'Another paragraph',
            {
                table: {
                  headerRows: 1,
                  widths: [ '*', '*', '*', '*' ],
                  body: [
                    [ 'First', 'Second', 'Third', 'The last one' ],
                    [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                    [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
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