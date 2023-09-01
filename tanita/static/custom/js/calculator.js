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
        .then(() => this.getClosest(Number(bmi).toFixed(1), define.list))
        .then((res) => {
          const resultArr = define.list.filter(e => e.value === res.value);
          const suitArr = define.list.filter(e => e.value === define.metadata.desirableVal);
          console.log(`res: `, res);
          console.log(`resultArr: `, resultArr);
          console.log(`suitArr: `, suitArr);
          console.log(`suit`, suitArr.map(e => e.index))
          return {
            result: this.renderSummary(resultArr, define.list),
            suit: this.renderSummary(suitArr, define.list),
          };
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
  }

  weightCal(gender, height, weight) {
    console.log(`Calculator: weightCal(${gender}, ${height}, ${weight}) >> `);
    return new Promise((resolve, reject) => {
      let define, hDefine, wDefine;
      Promise.resolve()
        .then(() => this.loadJson(`static/custom/json/weight.json`))
        .then((def) => define = def)
        .then(() => {
          hDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
          wDefine = this.getClosest(height, hDefine.value);
          const res = this.getClosest(weight, wDefine.value);
          const resultArr = wDefine.value.filter(e => e.value === res.value);
          const suitArr = wDefine.value.filter(e => e.value === define.metadata.desirableVal);
          return {
            result: this.renderSummary(resultArr, wDefine.value),
            suit: this.renderSummary(suitArr, wDefine.value),
          };
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  fatPercentCal(gender, age, fatPercent) {
    console.log(`Calculator: fatPercentCal(${gender}, ${age}, ${fatPercent}) >> `);
    return new Promise(async (resolve, reject) => {
      let define, aDefine, fDefine;
      Promise.resolve()
        .then(() => this.loadJson(`static/custom/json/fatPercent.json`))
        .then((def) => define = def)
        .then(() => {
          aDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
          fDefine = this.getClosest(age, aDefine.value);
          const res = this.getClosest(fatPercent, fDefine.value);
          const resultArr = fDefine.value.filter(e => e.value === res.value);
          const suitArr = fDefine.value.filter(e => e.value === define.metadata.desirableVal);
          return {
            result: this.renderSummary(resultArr, fDefine.value),
            suit: this.renderSummary(suitArr, fDefine.value),
          };
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  fatMassCal(gender, age, fatPercent, weight) {
    console.log(`Calculator: fatMassCal(${gender}, ${age}, ${fatPercent}, ${weight})`);
    return new Promise(async (resolve, reject) => {
      Promise.resolve()
        .then(() => this.fatPercentCal(gender, age, fatPercent))
        .then((fat) => {
          const fatMass = {
            result: this.ampSummary(fat.result, weight/100),
            suit: this.ampSummary(fat.suit, weight/100),
          };
          return fatMass;
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  muscleMassCal(gender, age, muscleMass) {
    console.log(`Calculator: fatPercentCal(${gender}, ${age}, ${fatPercent}) >> `);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/fatPercent.json`);
      let aDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
      //console.log(`aDefine: ${JSON.stringify(aDefine, null, 2)}`);
      let mmDefine = this.getClosest(age, aDefine.value);
      //console.log(`fpDefine: ${JSON.stringify(fpDefine, null, 2)}`);
      let summary = this.getClosest(muscleMass, mmDefine.value).value;
      let rangeArr = [];
      mmDefine.value.forEach((elem) => {
        if(elem.value == `Healthy`)
          rangeArr.push(elem.index);
      });
      let min = Math.min.apply(Math, rangeArr);
      let max = Math.max.apply(Math, rangeArr);
      let result = {
        "summary": summary,
        "min": (mmDefine.value.find((elem) => elem.value == `Underfat`)) ? min : null,
        "max": (mmDefine.value.find((elem) => elem.value == `Overfat`)) ? max : null
      }
      resolve(result);
    });
  }

  boneMassCal(gender, weight, val) {
    console.log(`Calculator: boneMassCal(${val})`);
    return new Promise(async (resolve, reject) => {
      let define = await this.loadJson(`static/custom/json/boneMass.json`);
      let gDefine = this.getClosest((gender == `male`) ? 1 : 2, define.list);
      let wDefine = this.getClosest(weight, gDefine.list);
      let rTarget = this.getClosest(val, wDefine);
      
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

  renderSummary(elemArr, defineArr) {
    console.log(`elemArr: `, elemArr);
    console.log(`defineArr: `, defineArr);
    const min =
      elemArr.length > 1
      ? Math.min(...(elemArr.map(e => e.index)))
      : this.isHighest(elemArr[0].index, defineArr) ? elemArr[0].index : null;
    const max = 
      elemArr.length > 1
      ? Math.max(...(elemArr.map(e => e.index)))
      : this.isLowest(elemArr[0].index, defineArr) ? elemArr[0].index : null;
    // let word;
    // if (min != null && max != null) word = `${min} - ${max}`;
    // else if (min === null) word = `< ${max}`;
    // else if (max === null) word = `> ${min}`;
    return {
      value: elemArr[0].value,
      word: this.generateWord(min, max),
      range: { min, max },
    }
  }

  generateWord(min, max) {
    let word;
    if (min != null && max != null) word = `${min} - ${max}`;
    else if (min === null) word = `< ${max}`;
    else if (max === null) word = `> ${min}`;
    return word;
  }

  ampSummary(sum, amp) {
    const rmin = sum.range.min;
    const rmax = sum.range.max;
    const res = {
      "value": sum.value,
      "range": {
        "min": rmin ? (rmin * amp).toFixed(1) : rmin,
        "max": rmax ? (rmax * amp).toFixed(1) : rmax,
      },
    };
    res.word = this.generateWord(res.range.min, res.range.max);
    return res;
  }

  getClosest(index, arr) {
    let diff = null;
    let resultIndex;
    // console.log(`index: ${index}`);
    arr.forEach((elem) => {
      let currDiff = Math.abs(index - elem.index);
      if(diff == null || diff > currDiff) {
        resultIndex = elem.index;
        diff = currDiff;
      }
      // console.log(`currDiff: ${currDiff} / diff: ${diff} / resultIndex: ${resultIndex}`);
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

  isLowest(index, arr) {
    console.log(`arr: `, arr);
    return Math.min(...(arr.map(e => e.index))) === index;
  }

  isHighest(index, arr) {
    return Math.max(...(arr.map(e => e.index))) === index;
  }
}