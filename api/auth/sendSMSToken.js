'use strict'

const OTP = require('otplib');
const AWS = require('aws-sdk');

OTP.authenticator.options = {
  step: 120, // 120 秒換一次密碼
};

const sns = new AWS.SNS({ region: 'us-east-1' });
const SMSType = {
  transactional: 'Transactional',
  promotional: 'Promotional',
}

module.exports.sendSMSToken = async (event, context, callback) => {
  let data = { phone: '' };
  let errors = [];
  let snsResData = {};

  try {
    data = JSON.parse(event.body);
  } catch (err) {
    errors.push(err);
    console.error(err);
  }

  // generate TOTP
  const secretKey = OTP.authenticator.generateSecret();
  const token = OTP.authenticator.generate(secretKey);

  try {
    const payload = {
      Message: `Hi, this is BiiMe.\nIt's your verify token: Bi-${token}.\nPlease verify in 2 mins! Thanks you.`,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: SMSType.promotional, // 記得改回來
        },
      },
      PhoneNumber: data.phone,
    };

    snsResData = await sns.publish(payload).promise();
  } catch (err) {
    errors.push(err);
    console.error(err, err.stack);
  }

  const response = {
    statusCode: errors.length > 0 ? 400 : 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      errors.length > 0
        ? { errors, snsResData }
        : { secretKey, token, snsResData }
    ),
  };
  callback(null, response);
  return response;
};
