const functions = require("firebase-functions");
const axios = require("axios");

const VERCEL_KEY = functions.config().keys.vercel;
const VERCEL_PENNA_PRJ_ID = functions.config().keys.vercel_penna_id;
const VERCEL_BASEURL = "https://api.vercel.com";

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

async function isDomainInUse(domain) {
  const options = {
    url: `${VERCEL_BASEURL}/v4/domains/${domain}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${VERCEL_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    let result = await axios(options);
    functions.logger.info("RESULT", {structuredData: true});
    functions.logger.info(result.data, {structuredData: true});
    return true;
  } catch (err) {
    functions.logger.info("ERROR", {structuredData: true});
    functions.logger.info(err, {structuredData: true});
    return false;
  }
}

exports.addDomain = functions.https.onCall(async (data, context) => {
  const domain = data.domain;

  if(await isDomainInUse(domain)) {
    return { success : false, message: "Domain is already registered"};
  } else {
    const options = {
      url: `${VERCEL_BASEURL}/v1/projects/${VERCEL_PENNA_PRJ_ID}/alias`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_KEY}`,
        'Content-Type': 'application/json'
      },
      data: { "domain": domain }
    };
    try {
      await axios(options);
      return { success : true, message: "Domain successfully added" };
    } catch (err) {
      return { success : false, message: "Action unsuccessful" };
    }
  }
});

// exports.domainInUse = functions.https.onCall(async (data, context) => {
//   const domain = data.domain;
//   const options = {
//     url: `${VERCEL_BASEURL}/v4/domains/${domain}`,
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${VERCEL_KEY}`,
//       'Content-Type': 'application/json'
//     }
//   };
//   try {
//     await axios(options);
//     return { data: { success : false } };
//   } catch (err) {
//     return { data: { success : true } };
//   }
// });

exports.verifyDomain = functions.https.onCall(async (data, context) => {
  const domain = data.domain;
  const options = {
    url: `${VERCEL_BASEURL}/v4/domains/${domain}/verify`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_KEY}`,
      'Content-Type': 'application/json'
    }
  };
  try {
    let result = await axios(options);
    functions.logger.info("RESULT", {structuredData: true});
    functions.logger.info(result.data, {structuredData: true});
    return { success: true, data: result.data };
  }
   catch (err) {
    functions.logger.info("ERROR", {structuredData: true});
    functions.logger.info(err.response.data.error, {structuredData: true});
    return { success: false, error: err.response.data.error };
    // return { data: err };
  }
});

