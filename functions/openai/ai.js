const functions = require("firebase-functions");
const { defineString } = require('firebase-functions/params');
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_ORG_ID = defineString('OPENAI_ORG_ID');
const OPENAI_SECRET_KEY = defineString('OPENAI_SECRET_KEY');

const configuration = new Configuration({
    organization: OPENAI_ORG_ID.value(),
    apiKey: OPENAI_SECRET_KEY.value()
});
const openai = new OpenAIApi(configuration);

const MODELS = [
	"text-davinci-003",
	"text-curie-001",
	"",
	""
]

exports.query = functions.https.onRequest(async (request, response) => {
		response.set('Access-Control-Allow-Origin', '*');
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');

	const query = request.query.query

	const BODY = {
		model: MODELS[0],
		prompt: `${query}`,
		temperature: 0.2,
		max_tokens: 200,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0,
	}

	try {
		const completion = await openai.createCompletion(BODY);
		console.log(completion.data.choices[0].text);
		response.send(completion.data);
	} catch (err) {
		functions.logger.info("ERROR", {structuredData: true});
		functions.logger.info(err, {structuredData: true});
		response.send(err);

	}
})

exports.models = functions.https.onRequest(async (request, response) => {
	// response.set('Access-Control-Allow-Origin', 'unnoun.com');
	response.set('Access-Control-Allow-Origin', '*');

	try {
		const models = await openai.listModels();
		response.send(models.data);
	} catch (err) {
		functions.logger.info(err.message, {structuredData: true});
		response.send(err);

	}
})
