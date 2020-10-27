const functions = require("firebase-functions");
//let functions = require('firebase-functions');
let admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//Static Push Notification Working Source Code
// exports.sendNotification = functions.database.ref('/lastmessage/')
//     .onWrite(event => {
//     let tokens = ["fGcL6evdsFk:APA91bE339001s0N8vTU8O-M42GMWNVgfPvw6wlWR_oWYnvJbkSem1tm34UU0QwxEdT0iL_WWePWFd8nEaHOJLhFtSxzgSF1IH_uZNfumu3VCCp9ameq0_VL2LFypLO5pme4AtY8YZSd6dHFa1GZ7yj0_j-Fl5TS1A"];
// 	 let payload = {
// 		  notification: {
// 		  title: "Hi",
// 		  body: "Hello",
// 		  sound: "default",
// 		  badge: "0"
// 		 }
// 		}
// 		return admin.messaging().sendToDevice(tokens, payload);
//     });

exports.userFavouritePin = functions.firestore
  .document("/orgReportedIncidents/{document_id}/favourite/{id}")
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null;
    //console.log(document);
    var messageJSON = JSON.stringify(document);
    console.log("==result==" + messageJSON);
    var document_id = context.params.document_id;
    console.log("==document_id==" + document_id);

    const docRef = db
      .collection("ColletionnName")
      .doc(document_id)
      .collection("subCollectionName")
      .where("isLike", "==", false);
    docRef
      .get()
      .then(function (querySnapshot) {
        var disLike_count = querySnapshot.size;
        console.log("is dislike count=>> " + disLike_count);
        if (disLike_count >= 5) {
          const docRef = db
            .collection("ColletionnName")
            .doc(document_id)
            .update({ IsActive: false });
          querySnapshot.forEach(function (doc) {
            var isLike = doc.get("isLike");
            console.log("===isLike=======" + isLike);
          });
        }
        return;
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        return;
      });
  });

exports.userFavouritePinUpdate = functions.firestore
  .document("/ColletionnName/{document_id}/favourite/{id}")
  .onCreate((snap, context) => {
    const newValue = snap.data();
    const promises = [];
    var document_id = context.params.document_id;
    console.log("post_id params.post_id=>> $$$$$$$$" + document_id);
    const docRef = db
      .collection("ColletionnName")
      .doc(document_id)
      .collection("subCollectionName")
      .where("isLike", "==", false);
    docRef
      .get()
      .then(function (querySnapshot) {
        var disLike_count = querySnapshot.size;
        console.log("is dislike count=>> " + disLike_count);
        if (disLike_count >= 5) {
          const docRef = db
            .collection("ColletionnName")
            .doc(document_id)
            .update({ IsActive: false });
          querySnapshot.forEach(function (doc) {
            var isLike = doc.get("isLike");
            console.log("===isLike=======" + isLike);
          });
        }
        return;
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        return;
      });
  });
/*    const docRef = db.collection("orgReportedIncidents").doc(document_id);
    docRef
      .get()
      .then(function (snapshot_post) {
        if (snapshot_post.exists) {
          var incidentDescription = snapshot_post.get("IncidentDescription");
          console.log("incidentDescription=>> $$$$$$$$" + incidentDescription);
          return;
        } else {
          throw new Error("Profile doesn't exist");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        return;
      });
 */
