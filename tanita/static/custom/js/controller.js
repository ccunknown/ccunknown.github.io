class Controller {
  constructor() {
    console.log(`this is controller.`);

    this.page = {
      "page1": {
        "view": "static/custom/views/page1.html",
        "viewId": "page1-workspace",
        "js": "static/custom/js/page1.js"
      },
      "page2": {
        "view": "static/custom/views/page2.html",
        "viewId": "page2-workspace",
        "js": "static/custom/js/page2.js"
      },
      "page3": {
        "view": "static/custom/views/page3.html",
        "viewId": "page3-workspace",
        "js": "static/custom/js/page3.js"
      },
      "page4": {
        "view": "static/custom/views/page4.html",
        "viewId": "page4-workspace",
        "js": "static/custom/js/page4.js"
      },
      // V2 of page2
      "page5": {
        "view": "static/custom/views/page5.html",
        "viewId": "page5-workspace",
        "js": "static/custom/js/page5.js"
      }
    };

    this.component = {
      "websocket": {
        "js": "static/custom/js/websocket.js"
      },
      "crypto": {
        "a256gcm": {
          "js": "static/custom/js/crypto-a256gcm.js"
        }
      }
    }

    this.params = {
       //Test Data.
      "primaryData": {
        "id": 999999999,
        "gender": "male",
        "bodytype": "standard",
        "termOfService": true,
        "height": "167",
        "clothWeight": "0.5",
        "age": "30",
        "name": "Anonymous"
      },
      "dataOrder": {
        id: { type: `string`, pattern: `^[-_0-9a-zA-Z]+$` },
        name: { type: `string` },
        gender: { enum: [ `male`, `female` ] },
        bodytype: { enum: [ `standard`, `athlete` ] },
        age: { type: `string`, pattern: `^\\d+$` },
        height: { type: `string`, pattern: `^\\d+\(.\\d+)?$` },
        clothWeight: { type: `string`, pattern: `^\\d+\(.\\d+)?$` },
      },
      "measurement": {"Model number":{"value":"MC-780"},"ID number":{"value":"E0024"},"Measurement status":{"value":"Normal end"},"Date":{"value":"04/09/2023"},"Time":{"value":"16:34"},"Body type":{"value":"standard"},"Gender":{"value":"male"},"Age":{"value":33,"unit":"age"},"Height":{"value":167,"unit":"cm"},"Clothes weight":{"value":0.5,"unit":"kg"},"Weight":{"value":82.9,"unit":"kg"},"Body fat %":{"value":28.3,"unit":"%"},"Fat mass":{"value":23.5,"unit":"kg"},"Fat free mass":{"value":59.4,"unit":"kg"},"Muscle mass":{"value":56.3,"unit":"kg"},"Muscle score":{"value":2},"Bone mass":{"value":3.1,"unit":"kg"},"TBW":{"value":39.8,"unit":"kg"},"TBW %":{"value":48,"unit":"%"},"Intracellular water (ICW)":{"value":23.8,"unit":"kg"},"Extracellular water (ECW)":{"value":16,"unit":"kg"},"ECW %":{"value":40.2,"unit":"%"},"BMI":{"value":29.7},"Standard body weight":{"value":61.4,"unit":"kg"},"Degree of obesity":{"value":35,"unit":"%"},"Standard fat %":{"value":17,"unit":"%"},"Standard muscle mass":{"value":48.3,"unit":"kg"},"Visceral fat rating":{"value":14},"Leg Muscle Score":{"value":95,"unit":"Score"},"BMR kcal":{"value":1695,"unit":"kcal"},"BMR kJ":{"value":7092,"unit":"kj"},"BMR score":{"value":6},"Metabolic Age":{"value":48,"unit":"Age"},"Muscle mass balance (arm)":{"value":0},"Muscle mass balance (leg)":{"value":2},"Target body fat %":{"value":0},"Predicted weight":{"value":0,"unit":"kg"},"Predicted fat mass":{"value":0,"unit":"kg"},"Fat to lose/gain":{"value":0,"unit":"kg"},"[Right Leg] Fat %":{"value":25.4,"unit":"%"},"[Right Leg] Fat mass":{"value":4.2,"unit":"kg"},"[Right Leg] Fat free mass":{"value":12.2,"unit":"kg"},"[Right Leg] Muscle mass":{"value":11.5,"unit":"kg"},"[Right Leg] Fat % score":{"value":2},"[Right Leg] Muscle mass score":{"value":3},"[Left Leg] Fat %":{"value":25.8,"unit":"%"},"[Left Leg] Fat mass":{"value":4.1,"unit":"kg"},"[Left Leg] Fat free mass":{"value":11.8,"unit":"kg"},"[Left Leg] Muscle mass":{"value":11.2,"unit":"kg"},"[Left Leg] Fat % score":{"value":2},"[Left Leg] Muscle mass score":{"value":3},"[Right Arm] Fat %":{"value":21.1,"unit":"%"},"[Right Arm] Fat mass":{"value":0.8,"unit":"kg"},"[Right Arm] Fat free mass":{"value":3,"unit":"kg"},"[Right Arm] Muscle mass":{"value":2.8,"unit":"kg"},"[Right Arm] Fat % score":{"value":2},"[Right Arm] Muscle mass score":{"value":2},"[Left Arm] Fat %":{"value":22.4,"unit":"%"},"[Left Arm] Fat mass":{"value":0.8,"unit":"kg"},"[Left Arm] Fat free mass":{"value":2.9,"unit":"kg"},"[Left Arm] Muscle mass":{"value":2.7,"unit":"kg"},"[Left Arm] Fat % score":{"value":3},"[Left Arm] Muscle mass score":{"value":1},"[Trunk] Fat %":{"value":31.6,"unit":"%"},"[Trunk] Fat mass":{"value":13.6,"unit":"kg"},"[Trunk] Fat free mass":{"value":29.5,"unit":"kg"},"[Trunk] Muscle mass":{"value":28.1,"unit":"kg"},"[Trunk] Fat % score":{"value":2},"[Trunk] Muscle mass score":{"value":2},"[LL-LA] R(1kHz)":{"value":0},"[LL-LA] X(1kHz)":{"value":0},"[LL-LA] R(5kHz)":{"value":610.5,"unit":"ohm"},"[LL-LA] X(5kHz)":{"value":-33.8,"unit":"ohm"},"[LL-LA] R(50kHz)":{"value":525.1,"unit":"ohm"},"[LL-LA] X(50kHz)":{"value":-61.7,"unit":"ohm"},"[LL-LA] R(250kHz)":{"value":466.7,"unit":"ohm"},"[LL-LA] X(250kHz)":{"value":-56.4,"unit":"ohm"},"[LL-LA] R(500kHz)":{"value":0},"[LL-LA] X(500kHz)":{"value":0},"[LL-LA] R(1000kHz)":{"value":0},"[LL-LA] X(1000kHz)":{"value":0},"[Right Leg] R(1kHz)":{"value":0},"[Right Leg] X(1kHz)":{"value":0},"[Right Leg] R(5kHz)":{"value":233.2,"unit":"ohm"},"[Right Leg] X(5kHz)":{"value":-13.7,"unit":"ohm"},"[Right Leg] R(50kHz)":{"value":197.3,"unit":"ohm"},"[Right Leg] X(50kHz)":{"value":-23.3,"unit":"ohm"},"[Right Leg] R(250kHz)":{"value":177,"unit":"ohm"},"[Right Leg] X(250kHz)":{"value":-15.6,"unit":"ohm"},"[Right Leg] R(500kHz)":{"value":0},"[Right Leg] X(500kHz)":{"value":0},"[Right Leg] R(1000kHz)":{"value":0},"[Right Leg] X(1000kHz)":{"value":0},"[Left Leg] R(1kHz)":{"value":0},"[Left Leg] X(1kHz)":{"value":0},"[Left Leg] R(5kHz)":{"value":246.5,"unit":"ohm"},"[Left Leg] X(5kHz)":{"value":-14.6,"unit":"ohm"},"[Left Leg] R(50kHz)":{"value":208.6,"unit":"ohm"},"[Left Leg] X(50kHz)":{"value":-24.7,"unit":"ohm"},"[Left Leg] R(250kHz)":{"value":187.3,"unit":"ohm"},"[Left Leg] X(250kHz)":{"value":-17,"unit":"ohm"},"[Left Leg] R(500kHz)":{"value":0},"[Left Leg] X(500kHz)":{"value":0},"[Left Leg] R(1000kHz)":{"value":0},"[Left Leg] X(1000kHz)":{"value":0},"[Right Arm] R(1kHz)":{"value":0},"[Right Arm] X(1kHz)":{"value":0},"[Right Arm] R(5kHz)":{"value":328.2,"unit":"ohm"},"[Right Arm] X(5kHz)":{"value":-18.7,"unit":"ohm"},"[Right Arm] R(50kHz)":{"value":282.9,"unit":"ohm"},"[Right Arm] X(50kHz)":{"value":-35,"unit":"ohm"},"[Right Arm] R(250kHz)":{"value":249.6,"unit":"ohm"},"[Right Arm] X(250kHz)":{"value":-37.1,"unit":"ohm"},"[Right Arm] R(500kHz)":{"value":0},"[Right Arm] X(500kHz)":{"value":0},"[Right Arm] R(1000kHz)":{"value":0},"[Right Arm] X(1000kHz)":{"value":0},"[Left Arm] R(1kHz)":{"value":0},"[Left Arm] X(1kHz)":{"value":0},"[Left Arm] R(5kHz)":{"value":339,"unit":"ohm"},"[Left Arm] X(5kHz)":{"value":-17.7,"unit":"ohm"},"[Left Arm] R(50kHz)":{"value":293.9,"unit":"ohm"},"[Left Arm] X(50kHz)":{"value":-35.5,"unit":"ohm"},"[Left Arm] R(250kHz)":{"value":259.4,"unit":"ohm"},"[Left Arm] X(250kHz)":{"value":-38.8,"unit":"ohm"},"[Left Arm] R(500kHz)":{"value":0},"[Left Arm] X(500kHz)":{"value":0},"[Left Arm] R(1000kHz)":{"value":0},"[Left Arm] X(1000kHz)":{"value":0},"[RL-LL] R(1kHz)":{"value":0},"[RL-LL] X(1kHz)":{"value":0},"[RL-LL] R(5kHz)":{"value":482.5,"unit":"ohm"},"[RL-LL] X(5kHz)":{"value":-28.8,"unit":"ohm"},"[RL-LL] R(50kHz)":{"value":408,"unit":"ohm"},"[RL-LL] X(50kHz)":{"value":-49,"unit":"ohm"},"[RL-LL] R(250kHz)":{"value":364.8,"unit":"ohm"},"[RL-LL] X(250kHz)":{"value":-33.4,"unit":"ohm"},"[RL-LL] R(500kHz)":{"value":0},"[RL-LL] X(500kHz)":{"value":0},"[RL-LL] R(1000kHz)":{"value":0},"[RL-LL] X(1000kHz)":{"value":0},"[Phase angle] LL-LA (50kHz)":{"value":-6.7,"unit":"degree"},"[Phase angle] Right Leg (50kHz)":{"value":-6.7,"unit":"degree"},"[Phase angle] Left Leg (50kHz)":{"value":-6.8,"unit":"degree"},"[Phase angle] Right Arm (50kHz)":{"value":-7,"unit":"degree"},"[Phase angle] Left Arm (50kHz)":{"value":-6.9,"unit":"degree"},"[Phase angle] RL-LL (50kHz)":{"value":-6.8,"unit":"degree"},"Check sum":{"value":"AE\r"}},

      "encrypt": true,
      "url": null,
      "jwt": null,
      "jwk": null,
      "page": null,
      "debug": false,
      "id": false,
      "barcode": false,
      "uploadpdf": false,
      "flags": ``,
    };
  }

  init() {
    return new Promise(async (resolve, reject) => {
      this.loader = new ResourceLoader();
      await this.initParams();
      await this.initWebsocket();
      if(this.params.encrypt)
        await this.initCrypto();
      for(let i in this.page) {
        await this.loadPage(i);
      }
      let page = (this.params.page) ? this.params.page : `page1`;
      this.displayPage(page);

      resolve();
    });
  }

  initParams() {
    return new Promise(async (resolve, reject) => {
      const queryString = window.location.search;
      console.log(queryString);
      const urlParams = new URLSearchParams(queryString);
      this.params.encrypt = urlParams.get(`encrypt`) == `true`;
      this.params.url = urlParams.get(`url`);
      this.params.jwt = urlParams.get(`jwt`);
      this.params.page = urlParams.get(`page`);
      this.params.flags = (urlParams.get(`flags`) || this.params.flags).split(`,`);
      this.params.debug = this.params.flags.includes(`debug`);
      this.params.id = this.params.flags.includes(`id`);
      this.params.barcode = this.params.flags.includes(`barcode`);
      this.params.uploadpdf = this.params.flags.includes(`uploadpdf`);
      this.params.uploadjson = this.params.flags.includes(`uploadjson`);

      resolve();
    });
  }

  initWebsocket() {
    return new Promise(async (resolve, reject) => {
      let Obj = await this.loader.loadJs(this.component.websocket.js);
      this.websocket = new Obj(this);
      await this.websocket.init();
      resolve();
    });
  }

  initCrypto() {
    return new Promise(async (resolve, reject) => {
      let Obj = await this.loader.loadJs(this.component.crypto.a256gcm.js);
      this.crypto = new Obj();
      let jwk = JSON.parse(JSON.stringify(await this.crypto.initKey()));
      console.log(`jwk: `, jwk);

      this.params.jwk = jwk;

      resolve();
    });
  }

  displayPage(index) {
    console.log(`>>>>>>>>>>>>>>>>>>> display ${index}`);
    for(let i in this.page) {
      this.page[i].object.vue.enabled = (i == index);
    }
    if (this.params.uploadpdf && [`page2`, `page5`].includes(index))
      $(document).ready(() => {
        console.log(">>>>>>>>>>>>> Page2 ready");
        this.page[index].object.upload();
      });
  }

  loadPage(index) {
    console.log(`Controller: loadPage(${index})`);
    return new Promise(async (resolve, reject) => {
      index = (index) ? index : this.page.map((elem, i) => i)[0];
      console.log(`index: ${index}`);
      let view = await this.loader.loadView(this.page[index].view);
      let Obj = await this.loader.loadJs(this.page[index].js);

      $(`#${this.page[index].viewId}`).html(view);

      this.page[index].object = new Obj(this, JSON.parse(JSON.stringify(this.page[index])));
      await this.page[index].object.init();
      resolve();
    });
  }
}
