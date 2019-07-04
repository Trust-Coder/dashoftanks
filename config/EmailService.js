// EmailService.js
const nodemailer = require("nodemailer");
//const mailgunTransport = require("nodemailer-mailgun-transport");

// keys
const keys = require("./keys");

// Configure transport options
const gmailOptions = {
  service: "gmail",
  auth: {
    user: keys.gmailUser,
    pass: keys.gmailPassword
  },
  tls: {
    rejectUnauthorized: false
  }
};
//const transport = mailgunTransport(gmailOptions);

class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(gmailOptions);
  }
  sendText(to, subject, text) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(
        {
          from: '"Dash of Tanks" <dashoftanks@gmail.com>',
          to,
          subject,
          text
        },
        (err, info) => {
          if (err) {
            console.log("EmailService: " + err);
            reject(err);
          } else {
            console.log("EmailService: " + info);
            resolve(info);
          }
        }
      );
    });
  }
}

/*
// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: keys.mailgunApiKey,
    domain: keys.mailgunApiUrl
  }
};
const transport = mailgunTransport(mailgunOptions);
// EmailService
class EmailService {
  constructor() {
    this.emailClient = nodemailer.createTransport(transport);
  }
  sendText(to, subject, text) {
    return new Promise((resolve, reject) => {
      this.emailClient.sendMail(
        {
          from: '"Your Name" <youremail@yourdomain.com>',
          to,
          subject,
          text
        },
        (err, info) => {
          if (err) {
            console.log("EmailService: " + err);
            reject(err);
          } else {
            console.log("EmailService: " + info);
            resolve(info);
          }
        }
      );
    });
  }
}
*/
module.exports = new EmailService();
