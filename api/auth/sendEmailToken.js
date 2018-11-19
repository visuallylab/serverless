'use strict'

const OTP = require('otplib');
const AWS = require('aws-sdk');
// using nodemailer@2.7.0 for demo, since it supports send mail without a relaying service.
const nodemailer = require('nodemailer');

OTP.authenticator.options = {
  step: 120, // 120 秒換一次密碼
};

module.exports.sendEmailToken = async (event, context, callback) => {
  let data = {};
  let errors = [];
  let emailResData = {};

  try {
    data = JSON.parse(event.body);
  } catch (err) {
    errors.push(err);
    console.error(err);
  }

  const secretKey = OTP.authenticator.generateSecret();
  const token = OTP.authenticator.generate(secretKey);

  /*  Sending email without a relaying service just for demo,
      In production,  It is better to rely on an actual SMTP service that is always accessible.
      Ex: Gamil, AWS-SES
      ref: https://nodemailer.com/usage/why-smtp/ */

  const transporter = nodemailer.createTransport();

  try {
    const payload = {
      // Custome sender address
      from: 'bot@biime.bot',
      to: data.email,
      subject: 'BiiMe Email verification',
      text: `Hi, this is BiiMe.\nIt's your verify token: Bi-${token}.\nPlease verify in 2 mins! Thanks you.`,
    };
    emailResData = await transporter.sendMail(payload);
  } catch (err) {
    errors.push(err);
    console.error(err, err.stack);
  }

  const response = {
    statusCode: errors.length > 0 ? 400 : 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      errors.length > 0
        ? { errors, emailResData }
        : { secretKey, token, emailResData }
    ),
  };
  callback(null, response);
  return response;
};
