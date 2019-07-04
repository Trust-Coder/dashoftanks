const EmailService = require("./config/EmailService");

EmailService.sendText("mytrustcoder@gmail.com", "Heloo tester", "you are done")
  .then(log => console.log(log))
  .catch(err => console.log(err));
