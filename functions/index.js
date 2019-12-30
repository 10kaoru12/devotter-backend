//import
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./atcontributter-firebase-adminsdk-5p86i-6e55085ef8.json');
const axios = require('axios');
const twitter = require('twitter');
const cors = require('cors')({ origin: true });
const decycle = require('json-decycle').decycle;
const retrocycle = require('json-decycle').retrocycle;

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
let senderAc;
let uploadPath;
let userId;
let problemCount;
let newProblemCount;

//main
exports.devotterCronJob = functions.region('asia-northeast1').https.onRequest((request, response) => {
    cors(request, response, () => {
        response.set('Access-Control-Allow-Origin', 'http://localhost:5000');
        response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
        response.set('Access-Control-Allow-Headers', 'Content-Type');
    });
    bucket.file('ac.json').download()
        .then((receiveJson) => {
            let receiveAc = JSON.parse(receiveJson);
            for (const element in receiveAc) {
                if (receiveAc[element].user_id === 'chokudai') {
                    problemCount = receiveAc[element].problem_count;
                    break;
                }
            }
            return axios.get("https://kenkoooo.com/atcoder/resources/ac.json", { headers: { 'accept-encoding': 'gzip' } });
            // senderAc = JSON.stringify(receiveAc);
            // uploadPath = 'generate.json';
            // bucket.file(uploadPath).save(senderAc);
        })
        .then((receiveNewJson) => {
            let receiveNewAcString = JSON.stringify(receiveNewJson, decycle());
            let receiveNewAc = JSON.parse(receiveNewAcString, retrocycle()).data;
            for (const element in receiveNewAc) {
                if (receiveNewAc[element].user_id === 'chokudai') {
                    newProblemCount = receiveNewAc[element].problem_count;
                    break;
                }
            }
            return firestore.collection('users').doc('kaoru1012').get();
        })
        .then(getAcceseTokenQuerySnapShot => {
            accessToken = getAcceseTokenQuerySnapShot.data().accessToken;
            accessTokenSecret = getAcceseTokenQuerySnapShot.data().accessTokenSecret;
            return firestore.collection('api').doc('keys').get();
        })
        .then(getConsumerKeyQuerySnapShot => {
            const consumerKey = getConsumerKeyQuerySnapShot.data().consumerKey;
            const consumerKeySecret = getConsumerKeyQuerySnapShot.data().consumerKeySecret;
            const client = new twitter({
                consumer_key: consumerKey,
                consumer_secret: consumerKeySecret,
                access_token_key: accessToken,
                access_token_secret: accessTokenSecret
            });
            client.post('statuses/update', {
                status: "今日の***さんのAC数は" + (newProblemCount - problemCount) + "でした。" }, (error, data, res) => {
                if (!error) {
                    console.log(res);
                    response.status(200).send("success!");
                }
                else {
                    console.log(res);
                    response.status(200).send(error);
                }
            });
            return 0;
        })
        .catch((error) => {
            response.status(200).send(error);
            return 0;
        });
});
