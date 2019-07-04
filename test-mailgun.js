const mailgun = require("mailgun-js");
const DOMAIN = "https://api.eu.mailgun.net/v3/email.dashoftanks.com";
const DOMAIN2 = "email.dashoftanks.com";
const api_key = "c7ba6776129051799ee7a9cf5cc7db43-2b0eef4c-532ce367";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
const data = {
  from: "Developer <developer@email.dashoftanks.com>",
  to: "mytrustcoder@gmail.com, developer@email.dashoftanks.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomness!"
};
mg.messages().send(data, function(error, body) {
  console.log(body);
});
