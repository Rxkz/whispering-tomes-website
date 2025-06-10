// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'rikhilprakash383@gmail.com', // Change to your recipient
  from: 'rikhilprakash383@gmail.com', // Change to your verified sender
  subject: 'Test Email from SendGrid',
  text: 'This is a test email sent from SendGrid using Node.js!',
  html: '<strong>This is a test email sent from SendGrid using Node.js!</strong>',
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error.response ? error.response.body : error.message)
  })