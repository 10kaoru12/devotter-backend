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
exports.devotterCronJob = functions.https.onRequest((request, response) => {
    // firestore.collection('users').doc('kaoru1012').get()
    //     .then(getAcceseTokenQuerySnapShot => {
    //         accessToken = getAcceseTokenQuerySnapShot.data().accessToken;
    //         accessTokenSecret = getAcceseTokenQuerySnapShot.data().accessTokenSecret;
    //         return firestore.collection('api').doc('keys').get();
    //     })
    //     .then(getConsumerKeyQuerySnapShot => {
    //         const consumerKey = getConsumerKeyQuerySnapShot.data().consumerKey;
    //         const consumerKeySecret = getConsumerKeyQuerySnapShot.data().consumerKeySecret;
    //         const client = new twitter({
    //             consumer_key: consumerKey,
    //             consumer_secret: consumerKeySecret,
    //             access_token_key: accessToken,
    //             access_token_secret: accessTokenSecret
    //         });
    //         client.post('statuses/update', { status: "devotter test tweet!" }, (error, data, res) => {
    //             if (!error) {
    //                 response.status(200).send(data);
    //             }
    //             else {
    //                 response.status(200).send("Twitter API post promise rejected.");
    //             }
    //         });
    //         return 0;
    //     })
    //     .catch(() => {
    //         response.status(200).send('Access Promise for each collection failed.');
    //         return 0;
    //     });

    // bucket.file('ac.json').download()
    //     .then((receiveJson) => {
    //         receiveAc = JSON.parse(receiveJson);
    //         for (const element in receiveAc) {
    //             if (receiveAc[element].user_id === 'kaoru1012') {
    //                 console.log(receiveAc[element].user_id);
    //                 console.log(receiveAc[element].problem_count);
    //                 break;
    //             }
    //         }
    //         return axios.get("https://kenkoooo.com/atcoder/resources/ac.json", { Headers: { 'accept-encoding': 'gzip' } });
    //         // senderAc = JSON.stringify(receiveAc);
    //         // uploadPath = 'generate.json';
    //         // bucket.file(uploadPath).save(senderAc);
    //     })
    //     .then((result) => {
    //         let data = JSON.parse(result);
    //         console.log(data);
    //         response.status(200).send(data);
    //         return 0;
    //     })
    //     .catch(() => {
    //         response.status(200).send('The download promise of firestore failed.');
    //         return 0;
    //     });
});
