var crypto = require('crypto');

module.exports = {

  encrypt: function (plainText) {
    return crypto.createHash('md5').update(plainText).digest('hex');
  },

  randomString: function (length) {
    var chars = '123456789ABCDEFGHJKLMNPRSTUVWXYZabcdefghkmnopqrstuwxyz';

    var string = '';

    for (var i = 0; i < length; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
  },

  randomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};