const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");

// const WIKIMEDIA_COMMONS_BASEURL = "https://en.wikipedia.org/w/api.php";

exports.wikiMediaImages = functions.https.onRequest(async (request, response) => {
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');
	response.set('Access-Control-Allow-Origin', '*');
	
	let searchTerm = request.query.query
	const options = {
		url: `https://commons.wikimedia.org/w/index.php?search=${searchTerm}&title=Special:MediaSearch&go=Go&type=image`,
		method: 'GET'
	};
	try {
		let result = await axios(options);
		let $ =  cheerio.load(result.data);
		let blocks = $('.sd-image');
		let images = [];
		for (let block of blocks) {
			images.push(block.attribs.src);
		}
		response.send(images);
	} catch (err) {
		functions.logger.info("ERROR", {structuredData: true});
		functions.logger.info(err, {structuredData: true});
		response.send(err);

	}
})