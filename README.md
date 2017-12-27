Facebook developer link:
https://developers.facebook.com/apps

Command for enabling page with app:
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<FB page token>"

Setting env variable in heroku:
heroku config:set FB_PAGE_ACCESS_TOKEN=<FB page token>

Heroku env variable can be accessed in code through:
let envVar = process.env.FB_PAGE_ACCESS_TOKEN;

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

Get Started Button:
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "test payload"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<FB page token>"