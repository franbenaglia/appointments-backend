const nodemailer = require('nodemailer');
const email = require('../config/constants.js').EMAIL;
const pass = require('../config/constants.js').PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: pass
    }
  });

  module.exports = transporter;