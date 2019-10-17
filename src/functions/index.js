'use strict';

// Import the Dialogflow module and response creation dependencies from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    Carousel,
    Image,
    BasicCard,
    Table,
    Button,
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
        text: '9:00: Coffee. 10:00: Diverse themas. 12:30: Dinner. 19: Party',
        display: 'WHITE',
    },
    'hotel': {
        title: 'Hotel',
        subtitle: 'Motel One Deutsches Museum',
        text: 'The hotel is located in the city centre. Breakfast is included. If you want to stay longer, you have to pay 20€.',
        image: {
            url: 'https://images.unsplash.com/photo-1504652517000-ae1068478c59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
            accessibilityText: 'Hotel Picture',
        },
        display: 'WHITE',
    },
    'projectile': {
        title: 'Projectile',
        subtitle: 'Intern-2019-GS',
        text: 'You can book 8 hours.',
        image: {
            url: 'https://images.unsplash.com/photo-1504197832061-98356e3dcdcf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
            accessibilityText: 'Projectile Picture',
        },
        buttons: new Button({
            title: 'Open Projectile',
            url: 'https://tomato-timer.com/',
        }),
        display: 'WHITE',
    },
};

const getBasicCard = (card) => new BasicCard(card);
const getAgendaTable = () => new Table({
    title: 'Agenda',
    dividers: true,
    columns: ['When?', 'What?'],
    rows: [
        ['9:00', 'Coffee'],
        ['10:00', 'Diverse themas'],
        ['12:30', 'Dinner'],
        ['19:00', 'Party'],
    ],
});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`Hi! JAM 2019 is coming. What would you like to know?`);
    conv.ask(getFaqCarousel());
});

app.intent('choose topic', (conv, {topic}) => {
    topic = conv.arguments.get('OPTION') || topic;
    conv.ask(answerMap[topic].text);
    if (conv.screen) {
        conv.ask(topic === 'agenda' ?
                getAgendaTable() :
                getBasicCard(answerMap[topic]));
    }
    conv.ask('Do you have more questions?');
    conv.ask(getYesNoSuggestions());
});

app.intent('choose topic - no', (conv) => {
    conv.ask('You can always check the website:',
        new BasicCard({
            text: 'JAM 2019 - Official Website',
            buttons: new Button({
                title: 'go to website',
                url: 'https://tomato-timer.com/',
            }),
        }));
    conv.close('As soon as you have any questions, just let me know. Have a nice day!');
});

app.intent('choose topic - yes', (conv) => {
    conv.ask('About which topic: agenda, accommodation or booking hours?');
    if (conv.screen) {
        return conv.ask(new Suggestions(['Agenda', 'Hotel', 'Projectile']));
    }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
