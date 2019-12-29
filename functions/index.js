//import
const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('./atcontributter-firebase-adminsdk-5p86i-6e55085ef8.json');

//initialize
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

//create instance
const firestore = admin.firestore();
const bucket = admin.storage().bucket();

//global
let consumerKey;
let consumerKeySecret;
let accessToken;
let accessTokenSecret;

//main
exports.devotterCronJob = functions.https.onRequest((request, response) => {
    firestore.collection("users").doc("kaoru1012").get()
        .then(querySnapShot => {
            accessToken = querySnapShot.data().accessToken;
            accessTokenSecret = querySnapShot.data().accessTokenSecret;
            console.log(accessToken);
            console.log(accessTokenSecret);
            return 0;
        })
        .catch(() => {
            response.status(200).send("Access Promise for collection users failed.");
            return 0;
        });
    firestore.collection("api").doc("keys").get()
        .then(querySnapShot => {
            consumerKey = querySnapShot.data().consumerKey;
            consumerKeySecret = querySnapShot.data().consumerKeySecret;
            console.log(consumerKey);
            console.log(consumerKeySecret);
            return 0;
        })
        .catch(() => {
            response.status(200).send("Access Promise for collection api failed.");
            return 0;
        });
    bucket.file("ac.json").download()
        .then((result) => {
            let receiveAc = JSON.parse(result);
            for (const element in receiveAc) {
                if (receiveAc[element].user_id === "kaoru1012") {
                    response.send(receiveAc[element].user_id);
                    console.log(receiveAc[element].user_id);
                    console.log(receiveAc[element].problem_count);
                    break;
                }
            }
            // let senderAc = JSON.stringify(receiveAc);
            // let uploadPath = "generate.json";
            // bucket.file(uploadPath).save(senderAc);
            return 0;
        })
        .catch(() => {
            response.status(200).send("The download promise of firestore failed.");
            return 0;
        });
});
