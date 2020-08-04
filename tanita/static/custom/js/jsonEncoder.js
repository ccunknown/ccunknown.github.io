export default class JsonAesEncoder {
  constructor() {

  }

  init() {
    return new Promise();
  }

  generateKey() {
    return new Promise(async (resolve, reject) => {
      let key = await crypto.subtle.generateKey({
        "name":"AES-CBC",
        "length":256
      },true,['encrypt','decrypt']);
      resolve(key);
    });
  }

  exportKey(key) {
    return new Promise(async (resolve, reject) => {
      let expKey = await crypto.subtle.exportKey('jwk', key);
      resolve(expKey);
    });
  }

  decrypt() {

  }
}