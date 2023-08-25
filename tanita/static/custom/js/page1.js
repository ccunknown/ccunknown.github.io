export default class Page1 {
  constructor(controller, schema) {
    this.controller = controller;
    this.schema = schema;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      await this.initVue();
      console.log(`Page1 init() complete.`);
      resolve();
    });
  }

  initVue() {
    return new Promise((resolve, reject) => {
      this.default = {};
      this.default.barcode = ``,
      this.default.form = {
        "gender": `male`,
        "bodytype": `standard`,
        "clothWeight": "0.5",
        "termOfService": false,
        "id": window.crypto.getRandomValues(new Uint32Array(1))[0]

        // "id": window.crypto.getRandomValues(new Uint32Array(1))[0],
        // "gender": "male",
        // "bodytype": "standard",
        // "termOfService": true,
        // "height": "167",
        // "clothWeight": "0.5",
        // "age": "30",
        // "name": "Pakawat"
      };

      this.vue = {};
      this.vue = new Vue({
        "el": `#page1-workspace`,
        "data": {
          "enabled": false,
          "ready": false,
          "state": `idle`,  //  idle, sending, weighing
          "debug": this.controller.params.debug,
          "showId": this.controller.params.id,
          "barcodeMode": this.controller.params.barcode,
          "barcodeActive": this.controller.params.barcode,
          "barcodeData": ``,
          "barcodeError": ``,
          "form": {},
          "resource": {}
        },
        "methods": {
          "start": () => {
            this.formCheck();
          },
          "toggleBarcodeForm": (event, val = !this.vue.barcodeActive) => {
            this.vue.barcodeActive = val;
            console.log(`toggle barcodeMode: `, this.vue.barcodeActive);
          },
          "onBarcodeCommit": () => {
            console.log(`onBarcodeCommit()`);
            try {
              this.vue.translateBarcodeData();
              this.vue.toggleBarcodeForm(null, false);
            } catch (err) {
              console.error(err);
            }
          },
          "onBarcodeChange": (...arg) => {
            // console.log(`onBarcodeChange(): `, arg)
            let data = `${this.vue.barcodeData}`;
            if (!data.endsWith(`\n`) && !data.endsWith(`$`))
              return ;
            if (data.endsWith(`$`))
              data = data.slice(0, data.length - 1);
              this.vue.barcodeData = data;
            try {
              this.vue.translateBarcodeData(data);
              this.vue.toggleBarcodeForm(null, false);
            } catch (err) {
              console.error(err);
            }
          },
          "translateBarcodeData": (data = this.vue.barcodeData) => {
            const ajv = new ajv7();
            this.vue.barcodeError = ``;
            const arr = data.split(`|`);
            console.log(`datas: `, arr);
            Object.entries(this.controller.params.dataOrder).forEach(([k, v]) => {
              let val = arr.shift();
              const tmpV = JSON.parse(JSON.stringify(v));
              delete tmpV.convertTo;
              const validate = ajv.compile(tmpV);
              const valid = validate(val);
              if (!valid) {
                const errMessage = `"${k}" ${validate.errors[0].message}`;
                this.vue.barcodeError = errMessage;
                throw new Error(errMessage);
              }
                // console.error(`"${k}" ${validate.errors[0].message}`);
                // console.error(validate.errors);
              else {
                if (v.convertTo === `number`)
                  val = Number(val);
                if (v.convertTo === `boolean`)
                  val = Boolean(val);
                this.vue.form[k] = val;
              }
              this.vue.form.termOfService = true;
            });
          }
        }
      });

      this.preset();

      resolve();
    });
  }

  preset() {
    this.vue.state = `idle`;
    this.vue.form = (this.vue.debug) ? 
      JSON.parse(JSON.stringify(this.controller.params.primaryData)) : 
      JSON.parse(JSON.stringify(this.default.form));
  }

  formCheck() {
    return new Promise(async (resolve, reject) => {
      if(!this.vue.form.name)
        alert('กรุณากรอกชื่อ-นามสกุล');
      else if(!this.vue.form.age)
        alert('กรุณากรอกอายุ');
      else if(!this.vue.form.gender)
        alert('กรุณาเลือกเพศด้วยค่ะ');
      else if(!this.vue.form.height)
        alert('กรุณากรอกส่วยสูงด้วยค่ะ');
      else if(!this.vue.form.clothWeight)
        alert('กรุณากรอกน้ำหนักเสื้อผ้า');
      else if(!this.vue.form.bodytype)
        alert('กรุณาเลือกสภาพทางร่างกายด้วยค่ะ');
      else if(!this.vue.form.id)
        alert('กรุณากรอกID');
      else if(!this.vue.form.termOfService)
        alert('กรุณากดปุ่มยินยอมรับข้อกำหนดการให้บริการด้วยค่ะ');
      else {
        console.log(`Page1: start() >> send`);
        await this.sendBrew();
      }
      resolve();
    });
  }

  sendBrew() {
    this.vue.state = `sending`;

    let url = this.controller.params.url;
    let jwt = this.controller.params.jwt;
    //this.vue.form.id = window.crypto.getRandomValues(new Uint32Array(1))[0];
    this.setWebsocket();
    Promise.resolve()
      .then(() => 
        fetch(`${url}/things/brew-0/actions`, {
          "method": "POST",
          "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": `Bearer ${jwt}`,
          },
          "body": JSON.stringify({
            "brew": {
              "input": {
                "bodytype": this.vue.form.bodytype,
                "gender": this.vue.form.gender,
                "age": this.vue.form.age,
                "cloth": this.vue.form.clothWeight,
                "height": this.vue.form.height,
                "id": this.vue.form.id,
                "jwk": (this.controller.params.jwk) ? this.controller.params.jwk : null,
              },
            },
          }),
        })
      )
      .then((res) => {
        console.log(`res: `, res);
      })
      .catch((err) => console.error(err));
  }

  setWebsocket() {
    this.websocket = this.controller.websocket;
    this.websocket.onMessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    console.log(`Page1: onMessage() >> `);
    console.log(event);

    return new Promise(async (resolve, reject) => {
      if(event.type == `message` && event.data) {
        let preData = JSON.parse(event.data);
        console.log(`preData: ${JSON.stringify(preData, null, 2)}`);
        //if(preData.id == `brew-0` && preData.messageType == `propertyStatus` && preData.data && preData.data.result) {
        if(preData.id == `brew-0` && preData.messageType == `propertyStatus` && preData.data) {
          //let data = JSON.parse(preData.data.result);
          let prop = preData.data;
          console.log(`prop: ${JSON.stringify(prop, null, 2)}`);
          if(prop && prop.result && prop.result != `null`) {
            let data = JSON.parse(prop.result);
            console.log(`get return result (id: ${data.id})`);
            let message = data.message;

            if(data.encrypt) {
              console.log(`message: ${message}`);
              message = await this.controller.crypto.decrypt(message);
            }
            
            console.log(`message: ${message}`);
            let result = JSON.parse(message);
            console.log(`result: ${JSON.stringify(result, null, 2)}`);

            this.controller.params.primaryData = JSON.parse(JSON.stringify(this.vue.form));
            this.controller.params.measurement = JSON.parse(JSON.stringify(result));
            this.nextPage();
          }
          else if(prop && prop.id && Number(prop.id) == Number(this.vue.form.id)) {
            console.log(`Weighing`);
            this.vue.state = `weighing`;
          }
        }
      }
      resolve();
    });
  }

  nextPage() {
    this.controller.displayPage(`page2`);
    this.controller.page.page2.object.translate();
  }
}