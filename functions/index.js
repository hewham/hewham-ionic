// const functions = require("firebase-functions");

// const dbpedia = require('./search/dbpedia');
const test = require('./helpers/test');
const helpers = require('./helpers/helpers');
const ai = require('./openai/ai');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.search = dbpedia;
exports.test = test;
exports.helpers = helpers;
exports.ai = ai;
