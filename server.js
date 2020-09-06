const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const configHelper = require('./util/config-helper');

const config = new configHelper();
const app = express();
const port = 8081

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Main page
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Get current minutes
app.get('/minutes', (req, res) => {
	res.json(config.get('minutes'));
});

// Use minutes
app.post('/minutes', (req, res) => {
	try {
		const remaining = updateMinutes(-parseInt(req.body.minutes));

		res.json(remaining);
	} catch (err) {
		res.status(400).send(err.message);
	}
});

// Add code
app.get('/code', (req, res) => {
	const code = req.query.code;
	const minutes = req.query.minutes;

	config.set(['codes', code], minutes);

	res.json(true);
});

// Use code
app.post('/code', (req, res) => {
	const code = req.body.code;

	try {
		useCode(code);
		res.json(config.get('minutes'));
	} catch (err) {
		res.status(400).send(err.message);
	}
});

/**
 * Update minutes
 *
 * @param {int} delta
 * @throws Error
 * @returns {int}
 */
function updateMinutes(delta) {
	// Get current minutes
	let minutes = parseInt(config.get('minutes'));

	// Update minutes
	minutes += delta;

	// Check if we have enough minutes left
	if (minutes < 0) {
		throw new Error("Nicht genügend Minuten");
	}

	// Update config
	config.set('minutes', minutes);

	return minutes;
}

/**
 * Use code
 *
 * @param {string} code
 * @throws Error
 */
function useCode(code) {
	// Get minutes for code
	const minutes = config.get(['codes', code]);

	if (minutes !== null) {
		// Update minutes
		updateMinutes(parseInt(minutes));

		// Remove code from config
		config.remove(['codes', code]);
		return;
	}

	// Code does not exist
	throw new Error("Code ungültig!");
}

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
