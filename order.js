'use strict';

module.exports = {
  getRequest: getRequest,
  decodeResponse: decodeResponse
};

const rc4 = require('./encrypt.js');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

const privateKey = fs.readFileSync( privateKeyPath ).toString();
const publicKey = fs.readFileSync( publicKeypath ).toString();

const xml2js = require('xml2js');
var builder = new xml2js.Builder({
  cdata: true
});
var parser = new xml2js.Parser({
  explicitArray: false
});

const getPayment = (orderId, amount, currency) => {
  let date = new Date();
  const data = {
    order: {
      $: {
        id: orderId,
        timestamp: date.getTime(),
        type: 'card'
      },
      signature: '<your_netopia_seller_account_signature>',
      url: {
        return: '<your_return_URL>',
        confirm: '<your_confirm_URL>'
      },
      invoice: {
        $: {
          currency: currency,
          amount: amount,
        },
        details: 'test plata',
        contact_info: {
          billing: {
            $: {
              type: 'person'
            },
            first_name: 'Test',
            last_name: 'Test',
            address: 'strada',
            email: 'test@mobilpay.ro',
            mobile_phone: 'mobilePhone'
          },
          shipping: {
            $: {
              type: 'person'
            },
            first_name: 'Test',
            last_name: 'Test',
            address: 'strada',
            email: 'test@mobilpay.ro',
            mobile_phone: 'mobilePhone'
          }
        }
      },
      ipn_cipher: 'aes-256-cbc',
    }
  }
  return { data, algorithm: 'aes-256-cbc' };
}

function getRequest(orderId) {
  const result = getPayment(orderId, 1, 'RON')
  let xml = builder.buildObject(result.data);

  return rc4.encrypt(publicKey, xml, result.algorithm);
}

function decodeResponse(data) {
  return new Promise(function (resolve, reject) {
    parser.parseString(rc4.decrypt(privateKey, data.iv, data.env_key, data.data, data.cipher), function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}