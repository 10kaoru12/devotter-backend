//import
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./atcontributter-firebase-adminsdk-5p86i-6e55085ef8.json');
const axios = require('axios');
const twitter = require('twitter')

//initialize
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

//create instance
const firestore = admin.firestore();
const bucket = admin.storage().bucket();

//global
let accessToken;
let accessTokenSecret;
let receiveAc;
let senderAc;
let uploadPath;

//main
exports.devotterCronJob = functions.https.onRequest(async (request, response) => {
    firestore.collection('users').doc('kaoru1012').get()
        .then(querySnapShot => {
            accessToken = querySnapShot.data().accessToken;
            accessTokenSecret = querySnapShot.data().accessTokenSecret;
            // eslint-disable-next-line promise/no-nesting
            firestore.collection('api').doc('keys').get()
                .then(querySnapShot => {
                    const consumerKey = querySnapShot.data().consumerKey;
                    const consumerKeySecret = querySnapShot.data().consumerKeySecret;
                    const client = new twitter({
                        consumer_key: consumerKey,
                        consumer_secret: consumerKeySecret,
                        access_token_key: accessToken,
                        access_token_secret: accessTokenSecret
                    });
                    client.get('statuses/user_timeline', (error, data, res) => {
                        if (!error) {
                            response.status(200).send(data);
                        }
                        else {
                            response.status(200).send(error);
                        }
                    })
                    return 0;
                })
                .catch(() => {
                    response.status(200).send('Access Promise for collection api failed.');
                    return 0;
                });
            return 0;
        })
        .catch(() => {
            response.status(200).send('Access Promise for collection users failed.');
            return 0;
        });

    // bucket.file('ac.json').download()
    //     .then((result) => {
    //         receiveAc = JSON.parse(result);
    //         for (const element in receiveAc) {
    //             if (receiveAc[element].user_id === 'kaoru1012') {
    //                 response.send(receiveAc[element].user_id);
    //                 console.log(receiveAc[element].user_id);
    //                 console.log(receiveAc[element].problem_count);
    //                 break;
    //             }
    //         }
    //         // senderAc = JSON.stringify(receiveAc);
    //         // uploadPath = 'generate.json';
    //         // bucket.file(uploadPath).save(senderAc);
    //         return 0;
    //     })
    //     .catch(() => {
    //         response.status(200).send('The download promise of firestore failed.');
    //         return 0;
    //     });
});
