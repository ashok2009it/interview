const Role = require('../db/models').Role;
const nodemailer = require('nodemailer');

class Helper {
  constructor() {}

  extractToken(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

  //mail
  async sendMail(argObj) {
    const mail = await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let options = argObj;
    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

module.exports = Helper;
