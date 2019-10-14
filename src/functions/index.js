'use strict';

// Import the Dialogflow module and response creation dependencies from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    Carousel,
    Image,
    BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

const getYesNoSuggestions = () => new Suggestions('Yes', 'No');

const getFaqCarousel = () => new Carousel({
    items: {
        'agenda': {
            title: 'Agenda',
            synonyms: ['agenda', 'plan', 'events'],
            image: new Image({
                url: 'https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1348&q=80',
                alt: 'Agenda Picture',
            }),
        },
        'hotel': {
            title: 'Hotel',
            synonyms: ['hotel', 'room', 'accommodation'],
            image: new Image({
                url: 'https://images.unsplash.com/photo-1504652517000-ae1068478c59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                alt: 'Hotel Picture',
            }),
        },
        'projectile': {
            title: 'Projectile',
            synonyms: ['projectile', 'book', 'hours'],
            image: new Image({
                url: 'https://images.unsplash.com/photo-1504197832061-98356e3dcdcf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                alt: 'Projectile Picture',
            }),
        },
    },
});

const answerMap = {
    'agenda': {
        title: 'Agenda',
        text: '9:00: Coffee. 10:00: Diverse themas. 12:00: Dinner. 19: Party',
        image: {
            url: 'https://images.unsplash.com/photo-1506784242126-2a0b0b89c56a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1348&q=80',
            accessibilityText: 'Agenda Picture',
        },
        display: 'WHITE',
    },
    'hotel': {
        title: 'Hotel',
        text: 'Hotel ****',
        image: {
            url: 'https://images.unsplash.com/photo-1504652517000-ae1068478c59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
            accessibilityText: 'Hotel Picture',
        },
        display: 'WHITE',
    },
    'projectile': {
        title: 'Projectile',
        text: 'You can book X hours',
        image: {
            url: 'https://images.unsplash.com/photo-1504197832061-98356e3dcdcf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
            accessibilityText: 'Projectile Picture',
        },
        display: 'WHITE',
    },
};

const getBasicCard = (card) => new BasicCard(card);

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`Hi! JAM 2019 is coming. What would you like to know?`);
    conv.ask(getFaqCarousel());
});

app.intent('choose topic', (conv, {topic}) => {
    topic = conv.arguments.get('OPTION') || topic;
    if (conv.screen) {
        conv.ask('Here you go.');
        conv.ask(getBasicCard(answerMap[topic]));
    } else {
        conv.ask(answerMap[topic].text);
    }
    conv.ask('Do you have more questions?');
    conv.ask(getYesNoSuggestions());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
