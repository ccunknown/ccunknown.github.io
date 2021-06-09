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
        "athelete": "standard",
        "termOfService": true,
        "height": "167",
        "clothWeight": "0.5",
        "age": "30",
        "name": "Anonymous"
      },
      "measurement": {"Model number":{"value":"MC-780"},"ID number":{"value":"0000001763315457"},"Measurement status":{"value":"Normal end"},"Date":{"value":"29/07/2020"},"Time":{"value":"10:40"},"Body type":{"value":"standard"},"Gender":{"value":"male"},"Age":{"value":30,"unit":"age"},"Height":{"value":167,"unit":"cm"},"Clothes weight":{"value":0.5,"unit":"kg"},"Weight":{"value":86.5,"unit":"kg"},"Body fat %":{"value":30.6,"unit":"%"},"Fat mass":{"value":26.5,"unit":"kg"},"Fat free mass":{"value":60,"unit":"kg"},"Muscle mass":{"value":56.9,"unit":"kg"},"Muscle score":{"value":2},"Bone mass":{"value":3.1,"unit":"kg"},"TBW":{"value":41.9,"unit":"kg"},"TBW %":{"value":48.4,"unit":"%"},"Intracellular water (ICW)":{"value":25.1,"unit":"kg"},"Extracellular water (ECW)":{"value":16.8,"unit":"kg"},"ECW %":{"value":40.1,"unit":"%"},"BMI":{"value":31},"Standard body weight":{"value":61.4,"unit":"kg"},"Degree of obesity":{"value":40.9,"unit":"%"},"Standard fat %":{"value":17,"unit":"%"},"Standard muscle mass":{"value":48.3,"unit":"kg"},"Visceral fat rating":{"value":15},"Leg Muscle Score":{"value":95,"unit":"Score"},"BMR kcal":{"value":1729,"unit":"kcal"},"BMR kJ":{"value":7234,"unit":"kj"},"BMR score":{"value":4},"Metabolic Age":{"value":45,"unit":"Age"},"Muscle mass balance (arm)":{"value":2},"Muscle mass balance (leg)":{"value":2},"Target body fat %":{"value":0},"Predicted weight":{"value":0,"unit":"kg"},"Predicted fat mass":{"value":0,"unit":"kg"},"Fat to lose/gain":{"value":0,"unit":"kg"},"[Right Leg] Fat %":{"value":24.8,"unit":"%"},"[Right Leg] Fat mass":{"value":4.5,"unit":"kg"},"[Right Leg] Fat free mass":{"value":13.7,"unit":"kg"},"[Right Leg] Muscle mass":{"value":13,"unit":"kg"},"[Right Leg] Fat % score":{"value":2},"[Right Leg] Muscle mass score":{"value":4},"[Left Leg] Fat %":{"value":25.9,"unit":"%"},"[Left Leg] Fat mass":{"value":4.4,"unit":"kg"},"[Left Leg] Fat free mass":{"value":12.7,"unit":"kg"},"[Left Leg] Muscle mass":{"value":12,"unit":"kg"},"[Left Leg] Fat % score":{"value":2},"[Left Leg] Muscle mass score":{"value":3},"[Right Arm] Fat %":{"value":19.4,"unit":"%"},"[Right Arm] Fat mass":{"value":0.7,"unit":"kg"},"[Right Arm] Fat free mass":{"value":3.1,"unit":"kg"},"[Right Arm] Muscle mass":{"value":2.9,"unit":"kg"},"[Right Arm] Fat % score":{"value":2},"[Right Arm] Muscle mass score":{"value":2},"[Left Arm] Fat %":{"value":20.9,"unit":"%"},"[Left Arm] Fat mass":{"value":0.7,"unit":"kg"},"[Left Arm] Fat free mass":{"value":2.7,"unit":"kg"},"[Left Arm] Muscle mass":{"value":2.5,"unit":"kg"},"[Left Arm] Fat % score":{"value":2},"[Left Arm] Muscle mass score":{"value":0},"[Trunk] Fat %":{"value":36.8,"unit":"%"},"[Trunk] Fat mass":{"value":16.2,"unit":"kg"},"[Trunk] Fat free mass":{"value":27.8,"unit":"kg"},"[Trunk] Muscle mass":{"value":26.5,"unit":"kg"},"[Trunk] Fat % score":{"value":3},"[Trunk] Muscle mass score":{"value":0},"[LL-LA] R(1kHz)":{"value":0},"[LL-LA] X(1kHz)":{"value":0},"[LL-LA] R(5kHz)":{"value":610.5,"unit":"ohm"},"[LL-LA] X(5kHz)":{"value":8.1,"unit":"ohm"},"[LL-LA] R(50kHz)":{"value":653.7,"unit":"ohm"},"[LL-LA] X(50kHz)":{"value":-91.9,"unit":"ohm"},"[LL-LA] R(250kHz)":{"value":442.8,"unit":"ohm"},"[LL-LA] X(250kHz)":{"value":-144.2,"unit":"ohm"},"[LL-LA] R(500kHz)":{"value":0},"[LL-LA] X(500kHz)":{"value":0},"[LL-LA] R(1000kHz)":{"value":0},"[LL-LA] X(1000kHz)":{"value":0},"[Right Leg] R(1kHz)":{"value":0},"[Right Leg] X(1kHz)":{"value":0},"[Right Leg] R(5kHz)":{"value":241,"unit":"ohm"},"[Right Leg] X(5kHz)":{"value":-11.5,"unit":"ohm"},"[Right Leg] R(50kHz)":{"value":191.6,"unit":"ohm"},"[Right Leg] X(50kHz)":{"value":-39.6,"unit":"ohm"},"[Right Leg] R(250kHz)":{"value":149.4,"unit":"ohm"},"[Right Leg] X(250kHz)":{"value":-30.7,"unit":"ohm"},"[Right Leg] R(500kHz)":{"value":0},"[Right Leg] X(500kHz)":{"value":0},"[Right Leg] R(1000kHz)":{"value":0},"[Right Leg] X(1000kHz)":{"value":0},"[Left Leg] R(1kHz)":{"value":0},"[Left Leg] X(1kHz)":{"value":0},"[Left Leg] R(5kHz)":{"value":216.2,"unit":"ohm"},"[Left Leg] X(5kHz)":{"value":-3,"unit":"ohm"},"[Left Leg] R(50kHz)":{"value":231.8,"unit":"ohm"},"[Left Leg] X(50kHz)":{"value":-12.8,"unit":"ohm"},"[Left Leg] R(250kHz)":{"value":165.2,"unit":"ohm"},"[Left Leg] X(250kHz)":{"value":-46.7,"unit":"ohm"},"[Left Leg] R(500kHz)":{"value":0},"[Left Leg] X(500kHz)":{"value":0},"[Left Leg] R(1000kHz)":{"value":0},"[Left Leg] X(1000kHz)":{"value":0},"[Right Arm] R(1kHz)":{"value":0},"[Right Arm] X(1kHz)":{"value":0},"[Right Arm] R(5kHz)":{"value":305.1,"unit":"ohm"},"[Right Arm] X(5kHz)":{"value":-15.4,"unit":"ohm"},"[Right Arm] R(50kHz)":{"value":266.3,"unit":"ohm"},"[Right Arm] X(50kHz)":{"value":-26.1,"unit":"ohm"},"[Right Arm] R(250kHz)":{"value":249,"unit":"ohm"},"[Right Arm] X(250kHz)":{"value":-31.8,"unit":"ohm"},"[Right Arm] R(500kHz)":{"value":0},"[Right Arm] X(500kHz)":{"value":0},"[Right Arm] R(1000kHz)":{"value":0},"[Right Arm] X(1000kHz)":{"value":0},"[Left Arm] R(1kHz)":{"value":0},"[Left Arm] X(1kHz)":{"value":0},"[Left Arm] R(5kHz)":{"value":314,"unit":"ohm"},"[Left Arm] X(5kHz)":{"value":-11.8,"unit":"ohm"},"[Left Arm] R(50kHz)":{"value":294.1,"unit":"ohm"},"[Left Arm] X(50kHz)":{"value":-14.2,"unit":"ohm"},"[Left Arm] R(250kHz)":{"value":279.1,"unit":"ohm"},"[Left Arm] X(250kHz)":{"value":-43.5,"unit":"ohm"},"[Left Arm] R(500kHz)":{"value":0},"[Left Arm] X(500kHz)":{"value":0},"[Left Arm] R(1000kHz)":{"value":0},"[Left Arm] X(1000kHz)":{"value":0},"[RL-LL] R(1kHz)":{"value":0},"[RL-LL] X(1kHz)":{"value":0},"[RL-LL] R(5kHz)":{"value":461.5,"unit":"ohm"},"[RL-LL] X(5kHz)":{"value":142.7,"unit":"ohm"},"[RL-LL] R(50kHz)":{"value":459.1,"unit":"ohm"},"[RL-LL] X(50kHz)":{"value":-36.9,"unit":"ohm"},"[RL-LL] R(250kHz)":{"value":362.3,"unit":"ohm"},"[RL-LL] X(250kHz)":{"value":-94.5,"unit":"ohm"},"[RL-LL] R(500kHz)":{"value":0},"[RL-LL] X(500kHz)":{"value":0},"[RL-LL] R(1000kHz)":{"value":0},"[RL-LL] X(1000kHz)":{"value":0},"[Phase angle] LL-LA (50kHz)":{"value":-8,"unit":"degree"},"[Phase angle] Right Leg (50kHz)":{"value":-11.7,"unit":"degree"},"[Phase angle] Left Leg (50kHz)":{"value":-3.2,"unit":"degree"},"[Phase angle] Right Arm (50kHz)":{"value":-5.6,"unit":"degree"},"[Phase angle] Left Arm (50kHz)":{"value":-2.8,"unit":"degree"},"[Phase angle] RL-LL (50kHz)":{"value":-4.6,"unit":"degree"},"Check sum":{"value":"56\r"}},

      "encrypt": true,
      "url": null,
      "jwt": null,
      "jwk": null,
      "debug": false,
      "page": null
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
      this.params.debug = urlParams.get(`debug`) == `true`;
      this.params.page = urlParams.get(`page`);
      this.params.url = urlParams.get(`url`);
      this.params.jwt = urlParams.get(`jwt`);
      this.params.encrypt = urlParams.get(`encrypt`) == `true`;

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
    for(let i in this.page) {
      this.page[i].object.vue.enabled = (i == index);
    }
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
