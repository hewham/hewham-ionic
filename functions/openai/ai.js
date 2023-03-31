const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-hN0R6oAFHN1WhB1cV8WOAEAB",
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "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",
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
	response.set('Access-Control-Allow-Origin', '*');
	try {
		const models = await openai.listModels();
		response.send(models.data);
	} catch (err) {
		functions.logger.info(err, {structuredData: true});
		response.send(err);

	}
})