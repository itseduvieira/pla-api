'use strict'

module.exports = {
    database: {
        url: 'mongodb://plandocdba:bar1306tolo@ds143738.mlab.com:43738/heroku_cwcqd368?authSource=heroku_cwcqd368'
    },
    jwt: {
        secret: '<secret>'
    },
    firebase: {
        database: 'https://plandoc-a13c7.firebaseio.com/',
        storage: 'plandoc-a13c7.appspot.com'
    },
    newrelic: {
        key: '2dc71181001c17dc34c0a9a7b2c48ca5bb4ae0bf'
    }
}