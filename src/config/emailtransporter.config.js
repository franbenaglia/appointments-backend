const nodemailer = require('nodemailer');
const email = require('../config/constants.js').EMAIL;
const pass = require('../config/constants.js').PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: email,
      pass: pass
    }
  });

  module.exports = transporter;