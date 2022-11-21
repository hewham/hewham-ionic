// const functions = require("firebase-functions");

const dbpedia = require('./search/dbpedia');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// 
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.search = dbpedia;


/* OLD VERCEL STUFF

const vercel = require('./old/vercel.js');

exports.addDomain = functions.https.onCall(async (data, context) => {
  return vercel.addDomain(data);
});

exports.verifyDomain = functions.https.onCall(async (data, context) => {
  return vercel.verifyDomain(data);
});

*/
