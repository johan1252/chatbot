Messenger Token:
my_voice_is_my_password_verify_me

Facebook developer link:
https://developers.facebook.com/apps

FB App Token:
EAAidYoZBZCnusBAJZB0P8sCZAes4TZBfUOdQkEvtqbTUZAssSukLpccaqTPUqbkiWQwCQBMLMoVNBZARSC6E83ZCSZABlJRN5F3sx292LqgK3W5p996Cvi2JfN7a7A7XK1kEpZBRU59gZBFqFcFZBd3MiR6nJarCSd7gEm0pL9URusQadgZDZD

Command for enabling page with app:
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAAidYoZBZCnusBAJZB0P8sCZAes4TZBfUOdQkEvtqbTUZAssSukLpccaqTPUqbkiWQwCQBMLMoVNBZARSC6E83ZCSZABlJRN5F3sx292LqgK3W5p996Cvi2JfN7a7A7XK1kEpZBRU59gZBFqFcFZBd3MiR6nJarCSd7gEm0pL9URusQadgZDZD"

Setting env variable in heroku:
heroku config:set FB_PAGE_ACCESS_TOKEN=EAAidYoZBZCnusBAJZB0P8sCZAes4TZBfUOdQkEvtqbTUZAssSukLpccaqTPUqbkiWQwCQBMLMoVNBZARSC6E83ZCSZABlJRN5F3sx292LqgK3W5p996Cvi2JfN7a7A7XK1kEpZBRU59gZBFqFcFZBd3MiR6nJarCSd7gEm0pL9URusQadgZDZD


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
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAidYoZBZCnusBAJZB0P8sCZAes4TZBfUOdQkEvtqbTUZAssSukLpccaqTPUqbkiWQwCQBMLMoVNBZARSC6E83ZCSZABlJRN5F3sx292LqgK3W5p996Cvi2JfN7a7A7XK1kEpZBRU59gZBFqFcFZBd3MiR6nJarCSd7gEm0pL9URusQadgZDZD"

Get Started Button:
curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "test payload"}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAidYoZBZCnusBAJZB0P8sCZAes4TZBfUOdQkEvtqbTUZAssSukLpccaqTPUqbkiWQwCQBMLMoVNBZARSC6E83ZCSZABlJRN5F3sx292LqgK3W5p996Cvi2JfN7a7A7XK1kEpZBRU59gZBFqFcFZBd3MiR6nJarCSd7gEm0pL9URusQadgZDZD"