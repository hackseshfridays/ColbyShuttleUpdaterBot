/*
  Even simpler, Twilio API wrapped code for sending text messages.

  Disrupt Colby 2019
  Author(s): robertDurst
*/
const accountSid = process.env.TWILIO_SSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendText = (phoneNumber, message) => {
  client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      })
      .then(message => console.log(message.sid))
      .done();
};

module.exports = {
  sendText,
}