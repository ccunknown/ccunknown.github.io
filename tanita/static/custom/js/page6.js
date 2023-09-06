export default class Page6 {
  constructor(controller, schema) {
    this.controller = controller;
    this.schema = schema;
    this.uploadRetry = 10;
  }

  init() {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.initVue())
        .then(() => this.initCalculator())
        .then(() => this.listTemplate())
        .then(() => {
          console.log(`pre trans`);
          // this.translate();
          console.log(`post trans`);
        })
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
          "file": null,
          "definition": {},
          "data": {},
          "fn": {},
          "loading": false,
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
        "getColor": (arg) => this.getColor(arg),
        "measurePage": () => {
          this.measurePage();
        },
        "homePage": () => {
          this.controller.homePage();
        },
        translate: (fname) => { this.translate(fname); },
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
      let definition;
      Promise.resolve()
        .then(() => this.vue.loading = true)
        .then(() => this.wait(100))
        .then(() => this.listTemplate())
        .then(() => {
          if (!file)
            return this.vue.fileList[0];
          else
            return this.vue.fileList.includes(file) ? file : null;
        })
        .then((fname) => this.vue.file = `/static/custom/json/${fname}`)
        .then(() => this.wait(100))
        .then((fname) => this.calculator.loadJson(this.vue.file))
        // .then((data) => this.enrich(data.list))
        // .then((data) => this.gatherIndex(data.list))
        .then((data) => {
          definition = data;
          this.vue.definition = definition;
          const rec = this.recreateData(data);
          return rec;
        })
        .then((data) => {
          console.log(`data: `, data);
          const rawCatesian = this.cartesianProduct(data.protoArray);
          console.log(`rawCatesian: `, rawCatesian);
          const catesian = rawCatesian
            .map(e => [...e, this.findAbsoluteVal(e, definition.list)]);
          console.log(`catesian: `, catesian);
          return {...data, catesian};
          // return data;
        })
        .then((res) => this.vue.data = res)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => this.vue.loading = false);
    });
  }

  getColor(arr) {
    // console.log(arr);
    let result = `#ffffff`
    const list  = this.vue.data.catesian;
    const elem = list.find(e => {
      // console.log(`arr: `, arr);
      // console.log(`e: `, e);
      const s = e.slice(0, e.length - 1);
      // console.log(`s: `, s);
      return JSON.stringify(arr) === JSON.stringify(s);
    });
    if (!elem)
      result = `#ffffff`;
    else {
      const val = elem[elem.length - 1];
      // console.log(val);
      try {
        result = this.vue.definition.metadata.valueDefinition[val].color;
      } catch(err) {
        result = this.stringToColour(val)
      }
      // result = this.vue.definition?.metadata?.valueDefinition[val]
      // ? this.vue.definition.metadata.valueDefinition[val].color
      // : this.stringToColour(val);
    }
    // console.log(`result: `, result);
    return result;
  }

  stringToColour(str) {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, '0');
    }
    return color;
  }

  findAbsoluteVal(originArr, list) {
    const arr = JSON.parse(JSON.stringify(originArr));
    const index = arr.shift();
    const elem = this.calculator.getClosest(index, list);
    return arr.length ? this.findAbsoluteVal(arr, elem.value) : elem.value;
  }

  // enrich(list) {
  //   let result = JSON.parse(JSON.stringify(list));
  //   // const indexLevel = [];
  //   // meta?.primaryIndex && indexLevel.append(meta.primaryIndex);
  //   // meta?.secondaryIndex && indexLevel.append(meta.secondaryIndex);
  //   // meta?.tertiaryIndex && indexLevel.append(meta.tertiaryIndex);
  //   const {min, max} = this.getIndexRange(list);
  //   result = result.map(e => {
  //     console.log(`e:`, e);
  //     let d = e.value
  //     if (Array.isArray(e.value) && e.value.length && Array.isArray(e.value[0].value)) {
  //       d = this.enrich(e.value);
  //     }
  //     return this.listFill(d);
  //   });
  //   return result;
  // }

  recreateData(origin) {
    const mapTable = [`primaryStep`, `secondaryStep`, `tertiaryStep`];
    const resultList = [];
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
    // const primaryList = origin.list;
    // protoArray[0].forEach(e => {
    //   const primary = this.calculator.getClosest(e, primaryList).value
    //   if (protoArray.length < 2)
    //     resultList.push([e, primary]);
    //   else
    //     protoArray[1].forEach()
    // });
    return { absoluteIndex, absoluteRange, protoArray };
  }

  enrichData(arr, list) {
    arr.map(e => {
      const target = this.calculator.getClosest(e, list).value
      if (protoArray.length < 2)
        return [e, target];
      else
        return protoArray[1].map(f => {
          this.enrichData()
        });
    });
  }

  gatherIndex(list, level=0) {
    let result = [];
    const arr = list.map(e => e.index);
    result.push(arr);
    if (list.length && Array.isArray(list[0].value)) {
      const childArr = [];
      list.forEach(e => {
        const cArr = this.gatherIndex(e.value);
        // console.log(`cArr: `, cArr);
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

  cartesianProduct(arrays) {
    // Handle the case where there are no arrays.
    if (arrays.length === 0) {
      return [[]];
    }
  
    // Use recursion to calculate the Cartesian product of arrays.
    function cartesianProductOfRest(arrays, currentIndex) {
      if (currentIndex === arrays.length - 1) {
        return arrays[currentIndex].map(function (element) {
          return [element];
        });
      }
  
      var currentArray = arrays[currentIndex];
      var subProduct = cartesianProductOfRest(arrays, currentIndex + 1);
  
      var result = [];
  
      for (var i = 0; i < currentArray.length; i++) {
        for (var j = 0; j < subProduct.length; j++) {
          result.push([currentArray[i]].concat(subProduct[j]));
        }
      }
  
      return result;
    }
  
    return cartesianProductOfRest(arrays, 0);
  }

  wait(delay) {
    console.log(`wait: ${delay}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delay);
    })
  }
}
