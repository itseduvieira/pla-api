'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

let fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../../assets/fonts', '/Roboto-Regular.ttf')
    }
}

let PdfPrinter = require('pdfmake/src/printer')
let printer = new PdfPrinter(fonts)

let data = {
    "number": "123",
    "seller": {
        "name": "Next Step Webs, Inc.",
        "road": "12345 Sunny Road",
        "country": "Sunnyville, TX 12345"
    },
    "buyer": {
        "name": "Acme Corp.",
        "road": "16 Johnson Road",
        "country": "Paris, France 8060"
    },
    "items": [{
        "name": "Website design",
        "price": 300
    }]
}

router.get('/report', (req, res) => {
    let dd = {
        content: [
            'First paragraph',
            'Another paragraph'
        ]
    }
    
    let doc = printer.createPdfKitDocument(dd)
    doc.pipe(res)
    doc.end()
})

module.exports = router