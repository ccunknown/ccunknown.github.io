export default class Page6 {
  constructor(controller, schema) {
    this.controller = controller;
    this.schema = schema;
    this.uploadRetry = 10;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      Promise.resolve()
        .then(() => this.initVue())
        .then(() => this.initCalculator())
        .then(() => this.listTemplate())
        .then(() => this.translate())
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  initVue() {
    return new Promise((resolve, reject) => {
      this.vue = new Vue({
        "el": `#page6-workspace`,
        "data": {
          "enabled": false,
          "debug": this.controller.params.debug,
          "fileList": [],
          "data": {},
          "fn": {},
        },
        "method": {},
      });

      this.vue.fn = {
        "print": (target) => {
          this.print(target);
        },
        "savePdf": (target) => {
          this.save(target);
        },
        "currentDateTime": () => {
          let topZero = (str, len) => {
            while(str.length < len)
              str = `0${str}`;
            return str;
          };

          let date = new Date();

          let day = topZero(`${date.getDate()}`, 2);
          let month = topZero(`${date.getMonth()}`, 2);
          let year = topZero(`${date.getFullYear()}`, 2);

          let hour = topZero(`${date.getHours()}`, 2);
          let minute = topZero(`${date.getMinutes()}`, 2);

          let result = `${year}-${month}-${day} ${hour}:${minute}`;
          return result;
        },
        "measurePage": () => {
          this.measurePage();
        },
        "homePage": () => {
          this.controller.homePage();
        },
        translate: (fname) => this.translate(fname),
      };

      resolve();
    });
  }

  initCalculator() {
    return new Promise(async (resolve, reject) => {
      let Obj = await this.controller.loader.loadJs(`static/custom/js/calculator.js`);
      //console.log(Obj);
      this.calculator = new Obj();
      resolve();
    });
  }

  translate(file) {
    return new Promise(async (resolve, reject) => {
      Promise.resolve()
        .then(() => this.listTemplate())
        .then(() => {
          if (!file)
            return this.vue.fileList[0];
          else
            return this.vue.fileList.includes(file) ? file : null;
        })
        .then((fname) => this.calculator.loadJson(`/static/custom/json/${fname}`))
        // .then((data) => this.enrich(data.list))
        // .then((data) => this.gatherIndex(data.list))
        .then((data) => this.recreateData(data))
        .then((data) => {
          console.log(`data: `, data);
          return data;
        })
        .then((res) => this.vue.data = res)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  enrich(list) {
    let result = JSON.parse(JSON.stringify(list));
    // const indexLevel = [];
    // meta?.primaryIndex && indexLevel.append(meta.primaryIndex);
    // meta?.secondaryIndex && indexLevel.append(meta.secondaryIndex);
    // meta?.tertiaryIndex && indexLevel.append(meta.tertiaryIndex);
    const {min, max} = this.getIndexRange(list);
    result = result.map(e => {
      console.log(`e:`, e);
      let d = e.value
      if (Array.isArray(e.value) && e.value.length && Array.isArray(e.value[0].value)) {
        d = this.enrich(e.value);
      }
      return this.listFill(d);
    });
    return result;
  }

  recreateData(origin) {
    const mapTable = [`primaryStep`, `secondaryStep`, `tertiaryStep`];
    const resultList = {};
    const absoluteIndex = this.gatherIndex(origin.list);
    const absoluteRange = absoluteIndex.map(e => {
      return {
        min: Math.floor(Math.min(...e)),
        max: Math.ceil(Math.max(...e))
      }
    });
    console.log(`absoluteIndex: `, absoluteIndex);
    console.log(`absoluteRange: `, absoluteRange);
    const protoArray = absoluteRange.map((e, i) => {
      const step = origin.metadata[mapTable[i]] || 1;
      console.log(`step: `, step);
      const arr = [];
      let val = e.min;
      while (val < e.max + step) {
        arr.push(val);
        val = val + step;
      }
      return arr;
    });
    return protoArray;
  }

  gatherIndex(list, level=0) {
    let result = [];
    const arr = list.map(e => e.index);
    result.push(arr);
    if (list.length && Array.isArray(list[0].value)) {
      const childArr = [];
      list.forEach(e => {
        const cArr = this.gatherIndex(e.value);
        console.log(`cArr: `, cArr);
        for (let i = 0; i < cArr.length; i++) {
          childArr.length < i + 1
          // ? childArr.push(cArr[i].flat(Infinity))
          ? childArr.push(cArr[i])
          : childArr[i] = [...childArr[i], ...cArr[i]];
        }
      });
      result = [...result, ...childArr]
      .map(e => [...new Set(e)].sort((a, b) => a - b));
    }
    return result;
  }

  listTemplate() {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => fetch(`/list`))
        .then((res) => res.json())
        .then((list) => this.vue.fileList = list.files)
        .then(() => this.vue.fileList)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  
  measurePage() {
    this.controller.displayPage(`page5`);
  }
}
