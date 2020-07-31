export default class Page4 {
  constructor(controller, schema) {
    this.controller = controller;
    this.schema = schema;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      await this.initVue();
      console.log(`Page4 init() complete.`);
      resolve();
    });
  }

  initVue() {
    return new Promise((resolve, reject) => {
      this.vue = new Vue({
        "el": `#page4-workspace`,
        "data": {
          "enabled": false,
          "form": {}
        },
        "method": {

        }
      });

      resolve();
    });
  }
}