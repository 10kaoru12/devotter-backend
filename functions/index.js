const functions = require('firebase-functions');

// const axios = require('axios');

const admin = require('firebase-admin');

const serviceAccount = require('./atcontributter-firebase-adminsdk-5p86i-6e55085ef8.json');
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);
const firestore = admin.firestore();

const bucket = admin.storage().bucket();

exports.devotterCronJob = functions.https.onRequest((request, response) => {
    firestore.collection("users").doc("kaoru1012").get()
        .then(querySnapShot => {
            response.send("hello");
            console.log(querySnapShot.data().accessTokenSecret);
            console.log(querySnapShot.data().accessToken);
            return 0;
        })
        .catch(() => {
            response.send("firestore access promise disconnecting error!");
            return 0;
        });

    bucket.file("ac.json").download()
        .then((result) => {
            let receiveAc = JSON.parse(result);
            console.log(receiveAc);
            let senderAc = JSON.stringify(receiveAc);
            let uploadPath = "generate.json";
            // eslint-disable-next-line promise/no-nesting
            bucket.file(uploadPath).save(senderAc);
            return 0;
        }).catch(() => {
            console.log("error");
            return
        });

    // firestore.collection("users").get()
    //     // eslint-disable-next-line promise/always-return
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             fetchedData = doc.id;
    //             console.log("data" + `${doc.id} => ${doc.data()}`);
    //         });
    //         response.send("data " + fetchedData);
    //     }).catch((error) => {
    //         response.send("data" + error);
    //     });
});
