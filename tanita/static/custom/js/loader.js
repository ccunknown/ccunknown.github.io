class ResourceLoader {
  constructor() {
    console.log(`resource loader.`);
  }

  loadView(path) {
    return new Promise((resolve, reject) => {
      fetch(path).then((res) => {
        resolve(res.text());
      }).catch((e) => {
        console.error(`Failed to fetch "${path}" : ${e}`);
      });
    });
  }

  loadJs(path) {
    return new Promise(async (resolve, reject) => {
      let obj = (await import(`../../../${path}`)).default;
      resolve(obj);
    });
  }
}