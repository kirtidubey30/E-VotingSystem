const Config = require("../../shared/config/config");
const CryptoJS = require("crypto-js");
const algorithm = "aes-256-ctr";
const privateKey = Config.key.privateKey;

exports.decrypt = function (password) {
  return decrypt(password);
};

exports.encrypt = function (password) {
  return encrypt(password);
};

function decrypt(password) {
  var bytes = CryptoJS.AES.decrypt(password, privateKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function encrypt(password) {
  var ciphertext = CryptoJS.AES.encrypt(password, privateKey).toString();
  return ciphertext;
}
