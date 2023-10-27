const nodemailer = require('nodemailer');
const fs = require('fs');
const _ = require('lodash');

async function sendEmail(mailOptions) {
  mailOptions.from = process.env.MAIL_USERNAME;
  mailOptions.subject = await parseTemplateSubject(mailOptions.subject, mailOptions.requiredParams);
  mailOptions.html = await parseTemplate(mailOptions.html, mailOptions.requiredParams);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 465,
    // secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

let mailOptions = {
  from: process.env.MAIL_USERNAME,
  to: process.env.MAIL_USERNAME,
  subject: '',
  text: ``,
};

async function parseTemplate(template, dataObj) {
  return new Promise(async (resolve) => {
    fs.readFile(template, 'utf8', async function (err, data) {
      template = data.replace(/\$\{.+?}/g, (match) => {
        let path = match.substr(2, match.length - 3).trim();
        return _.get(dataObj, path, '');
      });
      resolve(template);
    });
  });
}

async function parseTemplateSubject(template, dataObj) {
  return template.replace(/\$\{.+?}/g, (match) => {
    let path = match.substr(2, match.length - 3).trim();
    return _.get(dataObj, path, '');
  });
}

module.exports = { sendEmail, mailOptions };
