'use strict';

// Import the Dialogflow module and response creation dependencies from the Actions on Google client library.
const {
    dialogflow,
    Permission,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    const name = conv.user.storage.userName;
    if (!name) {
        // Asks the user's permission to know their name, for personalization.
        conv.ask(new Permission({
            context: 'Hi there, to get to know you better',
            permissions: 'NAME',
        }));
    } else {
        conv.ask(`Hi again, ${name}. What's your favorite color?`);
    }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
