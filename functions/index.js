const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./atcontributter-firebase-adminsdk-5p86i-6e55085ef8.json');
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);
const firestore = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
    firestore.collection("users").get()
        // eslint-disable-next-line promise/always-return
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                fetchedData = doc.id;
                console.log("data" + `${doc.id} => ${doc.data()}`);
            });
            response.send("data " + fetchedData);
        }).catch((error) => {
            response.send("data" + error);
        });
});
