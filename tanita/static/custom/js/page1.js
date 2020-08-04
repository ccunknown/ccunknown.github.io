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
      this.default.form = {
        "gender": `male`,
        "athelete": `standard`,
        "clothWeight": "0.5",
        "termOfService": false,
        "id": window.crypto.getRandomValues(new Uint32Array(1))[0]

        // "id": window.crypto.getRandomValues(new Uint32Array(1))[0],
        // "gender": "male",
        // "athelete": "standard",
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
          "form": {},
          "resource": {}
        },
        "methods": {
          "start": () => {
            this.formCheck();
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
      else if(!this.vue.form.athelete)
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
            "bodytype": this.vue.form.athelete,
            "gender": this.vue.form.gender,
            "age": this.vue.form.age,
            "cloth": this.vue.form.clothWeight,
            "height": this.vue.form.height,
            "id": this.vue.form.id,
            "jwk": this.vue.form.jwk
          }
        }
      })
    })
    .then((res) => {
    });
  }

  setWebsocket() {
    this.websocket = this.controller.websocket;
    this.websocket.onMessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    console.log(`Page1: onMessage() >> `);
    console.log(event);

    if(event.type == `message` && event.data) {
      let preData = JSON.parse(event.data);
      if(preData.id == `brew-0` && preData.messageType == `propertyStatus` && preData.data && preData.data.result) {
        let data = JSON.parse(preData.data.result);
        console.log(`data: ${JSON.stringify(data, null, 2)}`);
        if(data.id && data.id == this.vue.form.id) {
          console.log(`get return result (id: ${id})`);
          let encrypted = data.message;
          console.log(`message: ${encrypted}`);
          let result = this.controller.crypto.decrypt(encrypted);
          console.log(`result: ${JSON.stringify(result, null, 2)}`);

          this.controller.params.primaryData = JSON.parse(JSON.stringify(this.vue.form));
          this.controller.params.measurement = JSON.parse(JSON.stringify(data));
          this.nextPage();
        }
        else if(data && Number(data) == this.vue.form.id) {
          console.log(`Weighing`);
          this.vue.state = `weighing`;
        }
      }
    }
  }

  nextPage() {
    this.controller.displayPage(`page2`);
    this.controller.page.page2.object.translate();
  }
}