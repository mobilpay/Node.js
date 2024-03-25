'use strict';
const crypto = require('crypto');
const forge = require('node-forge');


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};

function encrypt(publicKey, data, algorithm) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const envKey = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, key);

    return {
        iv: iv.toString('base64'),
        envKey: envKey.toString('base64'),
        envData: encrypted,
        cipher: algorithm
    };
}

function decrypt(privateKey, iv, envKey, data, cipher) {
    const buffer = Buffer.from(envKey, 'base64');

    const privateKeyPem = forge.pki.privateKeyFromPem(privateKey);
    const symmetricKey = Buffer.from(privateKeyPem.decrypt(buffer, 'RSAES-PKCS1-V1_5'), 'binary');

    const decipher = crypto.createDecipheriv(cipher, symmetricKey, Buffer.from(iv, 'base64'));
    let dec = decipher.update(data, 'base64', 'utf8');
    dec += decipher.final('utf8');

    return dec;
}