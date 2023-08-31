export default class Calculator {
  constructor() {

  }

  bmiCal(bmi) {
    console.log(`Calculator: bmiCal(${bmi})`);
    return new Promise((resolve, reject) => {
      let define;
      Promise.resolve()
        .then(() => this.loadJson(`static/custom/json/bmi.json`))
        .then((def) => define = def)
        .then(() => this.rangeFinding(Number(bmi).toFixed(1), define.list))
        .then((res) => {
          return {
            summary: res.value,
            range: {
              lower: res.lowerIndex,
              upper: res.upperIndex,
            },
            desirable: define.metadata.desirable,
          };
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
  }

  weightCal(gender, height, weight) {
    console.log(`Calculator: weightCal(${gender}, ${height}, ${weight}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/weight.json`);
      let hDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
      //console.log(`hDefine: ${JSON.stringify(hDefine, null, 2)}`);
      let wDefine = this.getClosest(height, hDefine.value);
      //console.log(`wDefine: ${JSON.stringify(wDefine, null, 2)}`);
      let summary = this.getClosest(weight, wDefine.value).value;
      let rangeArr = [];
      wDefine.value.forEach((elem) => {
        if(elem.value == `Healthy`)
          rangeArr.push(elem.index);
      });
      let min = Math.min.apply(Math, rangeArr);
      let max = Math.max.apply(Math, rangeArr);
      let result = {
        "summary": summary,
        "min": (wDefine.value.find((elem) => elem.value == `Underweight`)) ? min : null,
        "max": (wDefine.value.find((elem) => elem.value == `Overweight`)) ? max : null
      }
      resolve(result);
    });
  }

  fatPercentCal(gender, age, fatPercent) {
    console.log(`Calculator: fatPercentCal(${gender}, ${age}, ${fatPercent}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/fatPercent.json`);
      let aDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
      //console.log(`aDefine: ${JSON.stringify(aDefine, null, 2)}`);
      let fpDefine = this.getClosest(age, aDefine.value);
      //console.log(`fpDefine: ${JSON.stringify(fpDefine, null, 2)}`);
      let summary = this.getClosest(fatPercent, fpDefine.value).value;
      let rangeArr = [];
      fpDefine.value.forEach((elem) => {
        if(elem.value == `Healthy`)
          rangeArr.push(elem.index);
      });
      let min = Math.min.apply(Math, rangeArr);
      let max = Math.max.apply(Math, rangeArr);
      let result = {
        "summary": summary,
        "min": (fpDefine.value.find((elem) => elem.value == `Underfat`)) ? min : null,
        "max": (fpDefine.value.find((elem) => elem.value == `Overfat`)) ? max : null
      }
      resolve(result);
    });
  }

  ecwPercentCal(val) {
    console.log(`Calculator: ecwPercentCal(${val}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/ecwPercent.json`);
      let result = this.getClosest(val, define.list);
      resolve(result.value);
    });
  }

  bmrCal(val) {
    console.log(`Calculator: bmrCal(${val}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/bmr.json`);
      let result = this.getClosest(val, define.list);
      resolve(result.value);
    });
  }

  vfrCal(val) {
    console.log(`Calculator: vfrCal(${val}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/vfr.json`);
      let result = this.getClosest(val, define.list);
      resolve(result.value);
    });
  }

  loadJson(path) {
    return new Promise((resolve, reject) => {
      fetch(path).then((res) => {
        resolve(res.json());
      }).catch((e) => {
        console.error(`Failed to fetch "${path}" : ${e}`);
      });
    });
  }

  getClosest(index, arr) {
    let diff = null;
    let resultIndex;
    console.log(`index: ${index}`);
    arr.forEach((elem) => {
      let currDiff = Math.abs(index - elem.index);
      if(diff == null || diff > currDiff) {
        resultIndex = elem.index;
        diff = currDiff;
      }
      console.log(`currDiff: ${currDiff} / diff: ${diff} / resultIndex: ${resultIndex}`);
    });
    return arr.find((elem) => elem.index == resultIndex);
  }

  rangeFinding(index, arr) {
    return arr.find((elem) => {
      if (elem.upperIndex && index > elem.upperIndex)
        return false;
      if (elem.lowerIndex && index < elem.lowerIndex)
        return false;
      return true;
    });
  }
}