const functions = require("firebase-functions");

exports.test = functions.https.onRequest(async (request, response) => {
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');
	response.set('Access-Control-Allow-Origin', '*');
	
	console.log("testing...");
	try {
		response.send("test function");
	} catch (err) {
		functions.logger.info(err, {structuredData: true});
		response.send(err);
	}
})