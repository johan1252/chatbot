'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

let Wit = null;
let log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN || "OUR5UL7GNDX26OMGVKF2UN2767A3ODKO";

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

const firstEntity = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

function handleMessage(question) {
  return wit.message(question).then(({entities}) => {
    const intent = firstEntity(entities, 'intent');
	console.log(entities)
    if (!intent) {
      // use app data, or a previous context to decide how to fallback
      return;
    }
    switch (intent.value) {
      case 'appt_make':
        console.log('🤖 > Okay, making an appointment');
        break;
      case 'appt_show':
        console.log('🤖 > Okay, showing appointments');
        break;
      default:
        console.log(`🤖  ${intent.value}`);
        break;
    }
  });
}


// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN
});

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
	console.log(messaging_events)
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
        if (event.postback) {
    	    let text = JSON.stringify(event.postback)
    	    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
    	    continue
        }
        if (event.referral) {
    	    let text = JSON.stringify(event.referral)
    	    sendTextMessage(sender, "Hi! I am Johan's personal chatbot, please ask me any questions related to Johan's personal experiences.")
			sendTextMessage(sender, "Type a phrase like \"What can you tell me about Johan?\" to get started.")
    	    continue
        }
      if (event.message && event.message.text) {
  	    let textIn = event.message.text
  	    if (textIn === 'Generic') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
		if (textIn === 'Dirk') {
			sendTextMessage(sender, "Dirk is one of the best brothers around.")
			continue
		}
  	    sendTextMessage(sender, "Text received, echo: " + textIn.substring(0, 200))

          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            sendTextMessage(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
          } else if (text) {
            // We received a text message

			handleMessage(text);
          }
		
		
      }

    }
	
	//Send status saying we received okay.
    res.sendStatus(200)
  })

const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "First card",
				    "subtitle": "Element #1 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})