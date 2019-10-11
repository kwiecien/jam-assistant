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
};

const getBasicCard = (card) => new BasicCard(card);

const agendaBasicCard = answerMap['agenda'];
const getAgendaBasicCard = () => getBasicCard(agendaBasicCard);

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`Hi! JAM 2019 is coming. Do you have any questions about it?`);
    conv.ask(getYesNoSuggestions());
});

app.intent('Default Welcome Intent - no', (conv) => {
    conv.close('Okay, but as soon as you have any questions, just let me know. Have a nice day!');
});

app.intent('Default Welcome Intent - yes', (conv) => {
    conv.ask('What would you like to know?');
    conv.ask(getFaqCarousel());
});

app.intent('agenda', (conv) => {
    conv.ask('Here you go.');
    if (conv.screen) {
        conv.ask(getAgendaBasicCard());
    } else {
        conv.ask(agendaBasicCard.text);
    }
    conv.ask('Do you have any other questions?');
    conv.ask(getYesNoSuggestions());
});

app.intent('agenda - no', (conv) => {
    conv.close('Okay, but as soon as you have any questions, just let me know. Have a nice day!');
});

app.intent('agenda - yes', (conv) => {
    conv.ask('What else is bothering you?');
    conv.ask(getFaqCarousel());
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
