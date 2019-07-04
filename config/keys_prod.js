module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretKey: process.env.SECRET_OR_KEY,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunApiUrl: process.env.MAILGUN_API_URL,
  gmailUser: process.env.GMAIL_SMTP_USER,
  gmailPassword: process.env.GMAIL_SMTP_PASSWORD
};
