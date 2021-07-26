require('dotenv').config({path: __dirname + '/.env'})
const express = require('express');
const RiveScript = require('rivescript');
const app = express();
const port = 3000;
const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN; 
//const client = require('twilio')(accountSid, authToken); 
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// client.messages.create({ 
//   from: process.env.WHATSAPP_FROM,       
//   to: process.env.WHATSAPP_TO,
//   body: 'Olá, caso necessite de ajude, digite *oi* para que possamos iniciar seu antedimento'
// }).then(message => console.log(message.sid)).done(); 

const chatBot = function() {
  var self = this;
  self.rs = new RiveScript();
  self.rs.loadDirectory("brain").then(self.loading_done).catch(self.loading_error);

  self.loading_done =  async function(req){
    self.rs.sortReplies();
    return await self.rs.reply('nome', req, self);
  }

  self.loading_error = function(error){
    console.log("Error when loading files: " + error);
  }

  self.getDataConsulta = function() {
      return Date.now
  };
}

const chatbot = new chatBot();

app.post('/message', async function(req, res, next) {
  const twiml = new MessagingResponse();
  twiml.message(await chatbot.loading_done(req.body['Body']));
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;