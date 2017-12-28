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

function firstEntity(entities, name) {
  return entities &&
    entities[name] &&
    Array.isArray(entities[name]) &&
    entities[name] &&
    entities[name][0];
}

let state = null;

function handleMessage(sender, question) {
  return wit.message(question).then(({entities}) => {
    const intent = firstEntity(entities, 'intent');
	const job_type = firstEntity(entities, 'job_type');
	const bye = firstEntity(entities, 'bye');
	const project_type = firstEntity(entities, 'project_type');
	
	//console.log(entities)
    if (!intent && !job_type && !project_type && !bye) {
      // use app data, or a previous context to decide how to fallback
		sendTextMessage(sender, "Im sorry, I didn't fully understand what you are asking, please try again.");
      return;
    }
	if (bye && bye.value) {
		state = "goodbye";
		sendTextMessage(sender, "Thanks for letting me talk about Johan's experiences.");
		setTimeout(function(){ sendTextMessage(sender, "If you have any other questions feel free to message me again 😃 or contact Johan at <j.cornelissen@queensu.ca>."); }, 100);
	} else if (project_type && project_type.value) {
		switch (project_type.value) {
  		  case 'QBnB':
		  	sendTextMessage(sender, "As part of a 3rd year databases course, Johan helped design a HTML/PHP based web application with a MySQL database for short-term housing rental. \
			  The project can be found at https://github.com/johan1252/QBnB.");
			//Could use a generic message instead so it's a button link.
  			break;
	      case 'CPU Design Project':
		  	sendTextMessage(sender, "In a group of 3 students, Johan designed, implemented and verified a simple RISC processor on an Altera DE0 board. \
			  VHDL hardware programming language and Altera Quartus II software was used to design the data path and control units in a systematic approach.");
  			setTimeout(function(){ sendTextMessage(sender, "The project can be found at https://github.com/johan1252/CPUDesignProject."); }, 100);
		    break;
		  case 'Autonomous Arduino Robot':
		  	sendTextMessage(sender, "As an introductory excercise to Arduino microcontroller programming, Johan designed and programed an Arduino robot to autonomously play a game of basketball.");
			setTimeout(function(){ sendTextMessage(sender, "Project can be found on Github at https://github.com/johan1252/ArduinoRobotBasketball."); }, 100);
		    break;
	      case 'D-FlipFlop Calculator':
	  	    sendTextMessage(sender, "Created a interactive javascript web application to assist students and the interested public in verifying D-Flipflop timing diagrams.\
			  Interest in the project was sparked through Johan's work as a teaching assistant for ELEC271 - Digital Systems.");
  			setTimeout(function(){ sendTextMessage(sender, "The web application can be used at http://dffcalculator.johancornelissen.com."); }, 100);  
		    break;
  	      default:
  	        console.log(`DEBUG: Unknown Project Type:${project_type.value}`);
  			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
  	        break;
		}
	} else if (job_type && job_type.value) {
		//if (state === "experience") {
			switch (job_type.value) {
	  		  case 'ciena':
  			  	sendTextMessage(sender, "At Ciena 💼, Johan was part of the Platform tools team, contributing to two releases of a new embeddeded software \
				  feature, creating mutliple automated test suites, and performing performance analysis contributing to major product simulator performance enhancements.");
	  			break;
  		      case 'project_manager':
			  	sendTextMessage(sender, "As a 4th year student at Queen's 🎓, Johan is a project manager for 2 first year engineering student teams. \
				  The two teams are responsible for creating a shift log generator application for a community client 👩🏻‍💼. \
				  As the project manager, Johan is responsible for advising and mentoring the students 👩🏽‍🎓👨🏻‍🎓, as well as working in partnership with the client and a Queen's faculty advisor.");
  			    break;
			  case 'teaching_assistant':
			  	sendTextMessage(sender, "As an upper year student in the Electrical and Computer Engineering department, Johan was a teaching assistant for ELEC271 in both 3rd and 4th year. \
				  Johan was responsible for assisting students with laboratory experiments related to using VHDL for programming a Altera Nios II processor 🖥.");
  			    break;
		      case 'photo_manager':
		  	    sendTextMessage(sender, "Having been a photography team member 📷 in the past for the Engineering Society at Queen's, Johan was hired on to be the photography manager for the society in the 2015-2016 school year. \
				  During this role, Johan managed a team of 6 photographers developing a strong leadership background as well as essential written and verbal communications skills.");
			    break;
	  	      default:
	  	        console.log(`DEBUG: Unknown Job Type:${job_type.value}`);
	  			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
	  	        break;
			}
			/*} else {
	        console.log(`DEBUG: Job type provided outside of job experience block: ${job_type.value}`);
			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
		} */
	} else {
	    switch (intent.value) {
	      case 'greeting_resp':
			state = "greeting";
			sendTextMessage(sender, "That's great!, I am doing well myself 😃.");
			setTimeout(function(){ sendTextMessage(sender, "Type a phrase like \"What can you tell me about Johan?\" to get started learning about Johan."); }, 100);
			  break;	
		  case 'greeting':
  			state = "greeting";
  			sendTextMessage(sender, "Hi there, how are you? 😃");
  			  break;
		  case 'whats_up':
			state = "whatsup";
  			sendTextMessage(sender, "I am doing great 😀, how about yourself?");
  			  break;  
		  case 'description_get':
			state = "desc";
			sendTextMessage(sender, "Johan is a 4th year Computer Engineering student at Queen’s University 🏫. \
			  He has interests in exploring opportunities related to cloud computing ☁️, high-level application development, \
			  open-source software, and DevOps 🖥.");
			setTimeout(function(){ sendTextMessage(sender, "Feel free to ask about Johan's education, work experience or personal projects for more details."); }, 100);
			  break;
		  case 'from_get':
			  state = "from";
			  sendTextMessage(sender, "Johan was originally born in the Netherlands 🇳🇱. In 2001, Johan's family immigrated to \
			  Canada 🇨🇦 to pursue a dairy farming operation.");
	      	  break;
		  case 'name_meaning':
			  state = "meaning";
			  sendTextMessage(sender, "Pronouned \"YO-hahn\", the name Johan means \"God is gracious\" when translated from Hebrew.");
	          break;
	      case 'job_experience':
			  state = "experience";
			  sendTextMessage(sender, "Outside of Johan's personal projects 🖥, Hackathon projects 👫, and academic achievements 🏫, Johan has gained \
			  essential computer engineering experience during his 16 month internship at Ciena in Ottawa 👨‍💻.");
			  setTimeout(function(){ sendTextMessage(sender, "For more detail on a specific experience, ask \"Tell me more about Ciena?\" etc.") }, 100);
	          break;
		  case 'project_experience':
			  state = "projects";
			  sendTextMessage(sender, "Johan has had the opportunity to work on multiple projects both during school 🎓 and during his personal time 🖥.");
			  setTimeout(function(){ sendTextMessage(sender, "Some of the projects Johan has worked on include, \"D-FlipFlop Calculator\" - A web application that verifies \
			  D-Flipflop timing 🕐 diagrams interactively, \"QBnB\" - a HTML/PHP web application for short term housing rental 🏠, \
			  \"CPU Design Project\" - a complete VHDL implementation of a RISC style processor 🖥, and \
			  \"Autonomous Arduino Robot\" - an autonomous Arduino robot that competed in a Basketball 🏀 competition."); }, 100);
			  setTimeout(function(){ sendTextMessage(sender, "For more detail on a specific experience, ask \"Tell me more about QBnB?\" etc."); }, 200);
	      default:
	        console.log(`DEBUG: Unknown intent:${intent.value}`);
			sendTextMessage(sender, `Im sorry, I didn't fully understand what you are asking, please try again.`);
	        break;
	    }
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
    	    sendTextMessage(sender, "Hi! I am Johan's personal chatbot 🤖, please ask me any questions related to Johan's personal experiences.")
			setTimeout(function(){ sendTextMessage(sender, "Type a phrase like \"What can you tell me about Johan?\" to get started."); }, 100);
    	    continue
        }
      if (event.message && event.message.text) {
  	    let textIn = event.message.text
  	    if (textIn === 'Generic') {
  		    sendGenericMessage(sender)
  		    continue
  	    }
		else if (textIn === 'Dirk') {
			sendTextMessage(sender, "Dirk is one of the best brothers around.")
			continue
		}
		else {
		  //General case send to AI
          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            sendTextMessage(sender, 'Sorry I can only process text messages for now. 🙁')
            .catch(console.error);
          } else if (text) {
            // We received a text message
			console.log("Handling message: " + text);
			handleMessage(sender, text);
          }
		
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