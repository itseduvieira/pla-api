'use strict'

module.exports = {
    database: {
        url: 'mongodb://plandocdba:<pass>@<host>.mlab.com:13505/<database>?authSource=<database>'
    },
    jwt: {
        secret: '<secret>'
    },
    firebase: {
        database: 'https://plandoc-a13c7.firebaseio.com/',
        storage: 'plandoc-a13c7.appspot.com'
    }
}