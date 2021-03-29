/* eslint-disable */
import * as functions from "firebase-functions";
import * as request from "request";
// import * as cors from "cors";
// import * as rp from "request-promise";

// const VERCEL_KEY = functions.config().keys.vercel;
const VERCEL_KEY = "kwUv6YOw0bK0S9igi2V6jgPs";
const VERCEL_BASEURL = "https://api.vercel.com";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, res) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!");
});

export const addDomain = functions.https.onRequest(async (req, res) => {
  // res.set('Access-Control-Allow-Headers','Content-Type')

  const domain = req.body.domain;
  console.log("domain: ", domain);

  const options:any = {
    url: `${VERCEL_BASEURL}/v4/domains`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_KEY}`,
      'Content-Type': 'application/json'
    },
    body: { "name": domain }
  };

  try {
    let result = await request(options);
    console.log("result: ", result);
    res.status(201).send("Success adding domain");
  } catch (err) {
    console.log("error: ", err);
    res.status(500).send("Error adding domain.")
  }


});

// export const domainStatus = functions.https.onRequest((req, res) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   res.send("Hello from Firebase!");
// });

// export const removeDomain = functions.https.onRequest((req, res) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   res.send("Hello from Firebase!");
// });

