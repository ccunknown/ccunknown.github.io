export default class CryptoA256GCM {
  constructor() {
    console.log(`CryptoA256GCM: constructor() >> `);
    this.cryptographer = new Jose.WebCryptographer();
    this.cryptographer.setKeyEncryptionAlgorithm('A128GCM');
    this.cryptographer.setContentEncryptionAlgorithm('A128GCM');
  }

  initKey() {
    return new Promise(async (resolve, reject) => {
      this.key = window.crypto.subtle.generateKey(
        {"name": "AES-GCM", "length": 256}, 
        true, 
        ["encrypt", "decrypt"]
      );
      this.jwk = await window.crypto.subtle.exportKey("jwk", this.key);

      resolve(this.jwk);
    });
  }

  decrypt(message) {
    return new Promise(async (resolve, reject) => {
      let decrypter = new Jose.JoseJWE.Decrypter(this.cryptographer, this.key);
      let result = await decrypter.decrypt(message);
      resolve(result);
    });
  }
}