const admin = require('firebase-admin')
const config = require('../../config/constants')
const serviceAccount = require('../../config/serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.database
})

let registrationToken = 'ctHhksi5L9s:APA91bFq2euz3-35iWQAwkVNz7YfeEgDYD100DRt82SlUHIm4WdgnU8JHdJ4SvDhCJ3imFQYZaXLFHEiYsNIUOFCn0kWWLv7tFdP_gjjXAAGffhN914sjQlutIM8yJqsEx1lAupAP6GRe25cIJxayB3yhxY9PB1nZA'

var message = {
    data: {
        score: '850',
        time: '2:45'
    },
    token: registrationToken
};

admin.messaging().send(message)
    .then((response) => {
        console.log('Successfully sent message:', response);

        admin.app().delete();
    })
    .catch((error) => {
        console.log('Error sending message:', error);

        admin.app().delete();
    });