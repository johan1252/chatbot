# Personal Chatbot Resume
Personal Facebook Messenger Chatbot created using wit.ai Artificial Intelligence software, Heroku Node.Js server, and Facebook's developer console.
Chatbot can be accessed through my personal website at http://johancornelissen.com.

##Intention
This chatbot was designed to autonomously assist recruiters viewing my personal resume website.
It serves to answer basic questions about my experience, hobbies, personal projects, autonomously without my involvement.
By using wit.ai open-source artificial intelligence software the javascript code can detect the user's intentions with confidence.

## Tools Used
* Facebook Developer Console : https://developers.facebook.com/apps
* Heroku : https://www.heroku.com
* Wit.Ai : https://wit.ai

## Future Enhancements:
For the future, it is recommended that the index.js code is tidied up.
This can be done by creating JSON files for each of the intents as well as for each "type" entity such as the "job_type" entity.
This would allow the code to be seperate from the data used to power the bot and removes unnecessary code clutter.

Additionally, the chatbot can always be improved using more AI training and extra intents and keywords.

## How to's:
### How to enable facebook page with a Facebook App:
After creating both a facebook page (https://www.facebook.com/pages/create) and a facebook app (through the developer console), they must be linked using the following command.
Command for enabling page with app:
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<FB page token>"
	
### How to set an environment variable in Heroku:
Setting env variable in heroku:
heroku config:set FB_PAGE_ACCESS_TOKEN=<FB page token>

Heroku env variable can be accessed in code through:
let envVar = process.env.FB_PAGE_ACCESS_TOKEN;

### How to change the Facebook greeting shown when first opening messenger conversation:
Change Greeting:
curl -X POST -H "Content-Type: application/json" -d '{
  "greeting": [
    {
      "locale":"default",
      "text":"Hi, Welcome to Johan Cornelissen'\''s personal chat bot. Type a phrase like \"What can you tell me about Johan?\" to get started." 
    }, {
      "locale":"en_US",
      "text":"Hi, Welcome to Johan Cornelissen'\''s personal chat bot. Type a phrase like \"What can you tell me about Johan?\" to get started."
    }
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<FB page token>"

### How to set the post-back payload when the "Get Started" button is pressed in Messenger
Get Started Button:
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "test payload"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<FB page token>"


## Author
* Johan Cornelissen
