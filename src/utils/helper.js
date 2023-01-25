const Role = require("../db/models").Role;
const nodemailer = require("nodemailer");

class Helper {
  constructor() {}

  extractToken(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}

module.exports = Helper;
