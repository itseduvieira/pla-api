'use strict'

const express = require('express')
const router = express.Router()

var PdfPrinter = require('pdfmake/src/printer')
var printer = new PdfPrinter()

//const Plane = require('../../model/report')

var data = {
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

var fonts = {
    Roboto: {
        normal: './fonts/Roboto-Regular.ttf'
    }
}

router.get('/report', (req, res) => {

    var dd = {
        content: [
            'First paragraph',
            'Another paragraph'
        ]
        }
        var pdfDoc = printer.createPdfKitDocument(dd);
        pdfDoc.pipe(fs.createWriteStream('basics.pdf')).on('finish',function(){
            res.send(pdfDoc)
        });
        pdfDoc.end();
})

module.exports = router