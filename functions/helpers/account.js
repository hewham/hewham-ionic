const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

async function decodeToken(token) {
	return new Promise((resolve, reject) => {
		admin.auth().verifyIdToken(token)
		.then(function(decodedToken) {
			var uid = decodedToken.uid;
			resolve(uid)
		}).catch((err) => {
			reject(err)
		})
	})
}

exports.limits = functions.https.onRequest(async (request, response) => {
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');
	response.set('Access-Control-Allow-Origin', '*');
	
	let token = request.query.query
	try {
		let uid = await decodeToken(token);
		admin.database().ref(`db/${uid}`)
      .once('value').then(snapshot => {
				let totalRows = 0;
				if(snapshot.val()){
					for(let key of Object.keys(snapshot.val())) {
						totalRows += snapshot.val()[key].rows.length;
					}
				}
				response.send({result: totalRows});
      });

	} catch (err) {
		functions.logger.info(err, {structuredData: true});
		response.send(err);
	}
})