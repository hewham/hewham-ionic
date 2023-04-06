const functions = require("firebase-functions");
const pluralize = require("pluralize");

exports.singular = functions.https.onRequest(async (request, response) => {
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');
	response.set('Access-Control-Allow-Origin', '*');
	
	let plural = request.query.query
	// console.log("plural: ", plural);
	try {
		if(pluralize.isSingular(plural)) {
			response.send({result: plural});
		} else {
			let single = pluralize.singular(plural);
			// console.log("single: ", single);
			response.send({result: single});
		}
	} catch (err) {
		functions.logger.info(err, {structuredData: true});
		response.send(err);

	}
})