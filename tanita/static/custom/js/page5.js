export default class Page5 {
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
        .then(() => {
          console.log(`Page5 init() complete.`);    
        })
        .then(() => this.translate())
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  }

  initVue() {
    return new Promise((resolve, reject) => {
      this.vue = new Vue({
        "el": `#page5-workspace`,
        "data": {
          "enabled": false,
          "debug": this.controller.params.debug,
          "measure": {},
          "statistic": {},
          "evaluate": {},
          "fn": {}
        },
        "method": {}
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
        "homePage": () => {
          this.homePage();
        }
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

  translate() {
    return new Promise(async (resolve, reject) => {
      //  Measurement mapping
      let measure = this.controller.params.measurement;
      this.vue.idmode = this.controller.params.id;
      this.vue.uploading = false;
      this.vue.measure = {
        //  Primary Data
        "name": this.controller.params.primaryData.name,
        "id": measure[`ID number`],
        "height": measure[`Height`],
        "age": measure[`Age`],
        "weight": measure[`Weight`],
        "clothWeight": measure[`Clothes weight`],
        "athelete": measure[`Body type`],
        "gender": measure[`Gender`],

        "boneMass": measure[`Bone mass`],
        "fatPercent": measure[`Body fat %`],
        "fatMass": measure[`Fat mass`],
        "bmi": measure[`BMI`],
        "metabolicAge": measure[`Metabolic Age`],
        "muscleMass": measure[`Muscle mass`],
        
        "tbw": measure[`TBW`],
        "tbwPercent": measure[`TBW %`],
        "ecw": measure[`Extracellular water (ECW)`],
        "icw": measure[`Intracellular water (ICW)`],
        "ecwPercent": measure[`ECW %`],
        "bmrKJ": measure[`BMR kJ`],
        "bmrKCal": measure[`BMR kcal`],
        "bmrScore": measure[`BMR score`],
        "vfr": measure[`Visceral fat rating`],
        
        "armLMuscleMass": measure[`[Left Arm] Muscle mass`],
        "armRMuscleMass": measure[`[Right Arm] Muscle mass`],
        "legLMuscleMass": measure[`[Left Leg] Muscle mass`],
        "legRMuscleMass": measure[`[Right Leg] Muscle mass`],
        "trunkMuscleMass": measure[`[Trunk] Muscle mass`],

        "armLFatPercent": measure[`[Left Arm] Fat %`],
        "armRFatPercent": measure[`[Right Arm] Fat %`],
        "legLFatPercent": measure[`[Left Leg] Fat %`],
        "legRFatPercent": measure[`[Right Leg] Fat %`],
        "trunkFatPercent": measure[`[Trunk] Fat %`],
        
        "armLFatMass": measure[`[Left Arm] Fat mass`],
        "armRFatMass": measure[`[Right Arm] Fat mass`],
        "legLFatMass": measure[`[Left Leg] Fat mass`],
        "legRFatMass": measure[`[Right Leg] Fat mass`],
        "trunkFatMass": measure[`[Trunk] Fat mass`]
      };

      //  Get statistic
      let evaluate = {};
      evaluate.weight = await this.calculator.weightCal(this.vue.measure.gender.value, this.vue.measure.height.value, this.vue.measure.weight.value);
      // evaluate.weightSuit = (evaluate.weight.min && evaluate.weight.max) ? `${evaluate.weight.min} - ${evaluate.weight.max}` : 
      //   (evaluate.weight.max) ? `< ${evaluate.weight.max}` : 
      //   (evaluate.weight.min) ? `> ${evaluate.weight.min}` : `?`;
      evaluate.fatPercent = await this.calculator.fatPercentCal(this.vue.measure.gender.value, this.vue.measure.age.value, this.vue.measure.fatPercent.value);
      evaluate.fatMass = await this.calculator.fatMassCal(
        this.vue.measure.gender.value, 
        this.vue.measure.age.value, 
        this.vue.measure.fatPercent.value,
        this.vue.measure.weight.value
      );
      // evaluate.fatPercentSuit = (evaluate.fatPercent.max && evaluate.fatPercent.max) ? `${evaluate.fatPercent.min} - ${evaluate.fatPercent.max}` : 
      //   (evaluate.fatPercent.max) ? `< ${evaluate.fatPercent.max}` : 
      //   (evaluate.fatPercent.min) ? `> ${evaluate.fatPercent.min}` : `?`;
      // evaluate.vfr = await this.calculator.vfrCal(this.vue.measure.vfr.value);
      // evaluate.bmr = await this.calculator.bmrCal(this.vue.measure.bmrKCal.value);
      evaluate.bmi = await this.calculator.bmiCal(this.vue.measure.bmi.value);
      // evaluate.ecwPercent = await this.calculator.ecwPercentCal(this.vue.measure.ecwPercent.value);

      this.vue.evaluate = evaluate;
      console.log(`evalueate: `, this.vue.evaluate);

      resolve();
    });
  }

  homePage() {
    this.controller.page.page1.object.preset();
    this.controller.displayPage(`page1`);
  }

  print(target) {
    console.log(`Page5: print(#${target}) >> `);
    $(`#${target}`).printThis({
      debug: false,               // show the iframe for debugging
      importCSS: true,            // import parent page css
      importStyle: false,         // import style tags
      printContainer: false,       // print outer container/$.selector
      //loadCSS: "C:/Users/WTB/Desktop/HTML/project_tanita/page5.css",                // path to additional css file - use an array [] for multiple
      //pageTitle: "Print my Document",              // add title to print page
      removeInline: false,        // remove inline styles from print elements
      removeInlineSelector: "*",  // custom selectors to filter inline styles. removeInline must be true
      printDelay: 500,           // variable print delay
      //header: "<h1 class='w3-center'>Print my Document</h1>",               // prefix to html
      footer: null,               // postfix to html
      base: false,                // preserve the BASE tag or accept a string for the URL
      formValues: true,           // preserve input/form values
      canvas: false,              // copy canvas content
      doctypeString: '<!DOCTYPE html>', // enter a different doctype for older markup
      removeScripts: false,       // remove script tags from print content
      copyTagClasses: false,      // copy classes from the html & body tag
      beforePrintEvent: null,     // callback function for printEvent in iframe
      beforePrint: null,          // function called before iframe is filled
      afterPrint: null            // function called before iframe is removed
    });
  }

  wait(sec) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), sec * 1000);
    });
  }

  upload(
    uploadPdf = this.controller.params.uploadpdf,
    uploadJson = this.controller.params.uploadjson,
  ) {
    console.log(`upload(pdf:${uploadPdf},json:${uploadJson})`);
    if (!uploadPdf && !uploadJson)
      return Promise.resolve();
    let pdfBlob = null;
    let jsonBlob = null;
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(() => this.vue.uploading = true)
        .then(() => this.wait(3))
        .then(() => uploadPdf ? this.craftBlobPdf() : null)
        .then((blob) => pdfBlob = blob)
        .then(() => uploadJson ? this.craftBlobJson() : null)
        .then((blob) => jsonBlob = blob)
        .then(() => {
          const data = new FormData();
          pdfBlob && data.append(`file`, pdfBlob, this.craftFileName());
          jsonBlob && data.append(`file`, jsonBlob, this.craftFileName(`json`));
          return data;
        })
        .then((payload) => this.fetchRetry(
          `/upload`,
          { method: `POST`, body: payload }
        ))
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => this.vue.uploading = false);
    });
    
  }

  craftBlobJson() {
    console.log(`upload json fn()`);
    return Promise.resolve()
      .then(() => {
        const blob = new Blob(
          [JSON.stringify(this.controller.params.measurement, null, 2)],
          { type: `application/json` }
        );
        return blob
      });
  }

  craftBlobPdf() {
    console.log(`upload pdf fn()`);
    return Promise.resolve()
      .then(() => this.craftDoc())
      // .then((doc) => doc.save(`${this.vue.measure}.tanita.pdf`))
      .then((doc) => {
        const blob = new Blob(
          [doc.output(`blob`)],
          { type: `application/pdf` }
        );
        console.log(`blob: `, blob);
        return blob;
      });
  }

  fetchRetry(url, fetchOptions = {}, tries = this.uploadRetry) {
    console.log(`fetchRetry: `, tries);
    const onError = (err) => {
      console.error(err);
      const triesLeft = tries - 1;
      if(!triesLeft){
          throw err;
      }
      return this.fetchRetry(url, fetchOptions, triesLeft);
    }
    return fetch(url, fetchOptions).catch(onError);
  }

  save() {
    console.log(`save pdf fn()`);
    Promise.resolve()
      .then(() => this.craftDoc())
      .then((doc) => doc.save(`tanita.pdf`));
  }

  craftFileName(typ = `pdf`) {
    return `${this.vue.measure.id.value}.tanita.${typ}`
  }

  craftDoc() {
    return new Promise(async (resolve, reject) => {
      const detailBoost = 2;
      const body = $(`body`);
      const report = $(`#page5-hidden-report`);
      const reportElem = $(`#page5-report-container`).clone(true);
      const reportBanner = $(`#page5-banner`).clone(true);
      report.empty();
      report.append(reportBanner);
      report.append(reportElem);
      body.css({"width": "1000px", "max-width": "1000px", "min-width": "1000px"});
      report.css({"width": "1000px", "max-width": "1000px", "min-width": "1000px", "display": "block"});
      EQCSS.apply();

      console.log(`pre gen`);
      this.treatSvg();
      let imgArr = [
        // this.generateCanvas(report),
        this.generateCanvas(document.getElementById(`page5-hidden-report`), detailBoost),
      ];

      report.empty();
      body.css({"width": "100%", "max-width": "100%", "min-width": "100%"});
      report.css({"display": "none"});
      EQCSS.apply();

      console.log(`post gen`);
      Promise.all(imgArr)
        .then((canvasArr) => {
          let div = 5 * detailBoost;
          let arr = canvasArr.map((elem) => {
            let img = elem.toDataURL(`image/png`);
            let result = {
              "canvas": elem,
              "img": img,
              "size": {
                "w": elem.width/div,
                "h": elem.height/div
              }
            };
            return result;
          });

          const { jsPDF } = window.jspdf;
          let doc = new jsPDF(`p`, `mm`, `A4`);

          var width = doc.internal.pageSize.width;
          var height = doc.internal.pageSize.height;

          console.log(`width: ${width}`);
          console.log(`height: ${height}`);
          console.log(`size.w: ${arr[0].size.w}`);

          let wLeft = (width - arr[0].size.w)/2;
          doc.addImage(arr[0].img, 'PNG', wLeft, 5, arr[0].size.w, arr[0].size.h);
          
          resolve(doc);
        });
    });
  }

  treatSvg() {
    var svgElements = document.body.querySelectorAll('svg');
    svgElements.forEach(function(item) {
      item.setAttribute("width", item.getBoundingClientRect().width);
      item.setAttribute("height", item.getBoundingClientRect().height);
      item.style.width = null;
      item.style.height= null;
    });
  }

  getCanvas(target) {
    return new Promise((resolve, reject) => {
      let elem = $(`#${target}`);
      // let elem = $(`${target}`);
      html2canvas(elem, {
        onrendered: function(canvas) {
          resolve(canvas);
        }
      });
    });
  }
  generateCanvas(elem, scale = 1) {
    return new Promise((resolve, reject) => {
      // let elem = $(`${target}`);
      let result = html2canvas(elem, { scale });
      resolve(result);
    });
  }
}
