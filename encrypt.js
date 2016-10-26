'use strict';
const crypto = require( 'crypto' );
const rc4 = require( 'arc4' );

const constants = require( "constants" );
module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};

function encrypt( publicKey, data ) {
    let key = crypto.randomBytes( 32 );
    var cipher = rc4( 'arc4', key);
    let encrypted = cipher.encode( data, 'binary', 'base64' );


    let envKey = crypto.publicEncrypt( {
        key: publicKey,
        padding: constants.RSA_PKCS1_PADDING
    }, key );
    return {
        envKey: envKey.toString( 'base64' ),
        envData: encrypted
    };

}

function decrypt( privateKey, envKey, data ) {
    let buffer =  Buffer.from( envKey,'base64' );
    var decrypted = crypto.privateDecrypt( {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING
    }, buffer );
    var cipher = rc4( 'arc4', decrypted);
    let dec = cipher.decode( Buffer.from(data,'base64'), 'utf8' );
    return dec;
}
