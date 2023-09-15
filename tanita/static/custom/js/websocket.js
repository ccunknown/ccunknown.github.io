export default class Websocket {
  constructor(controller) {
    this.controller = controller;
    this.ready = false;

    // this.wsPeriod = null;
    // this.wsStatusTimeout = null;
    this.retryInterval = 5000;

    this.listeners = [];
  }

  init() {
    return new Promise((resolve, reject) => {
      this.ready = false;
      this.initWebsocket(this.controller.params.url, this.controller.params.jwt);
      resolve();
    });
  }

  initWebsocket(url, jwt) {
    console.log(`Websocket: initWebsocket()`);
    console.log(`>> url: ${url}`);
    console.log(`>> jwt: ${jwt}`);
    let ws = `${url.replace(/^http/g, `ws`).replace(/\/$/g, ``)}/things?jwt=${jwt}`;
    console.log(`>> ws: ${ws}`);
    this.socket = new WebSocket(ws);

    // init websocket event.
    this.socket.onopen = () => {this.onOpen()};
    this.socket.onmessage = (event) => {this.onMessage(event)};
    this.socket.onclose = (event) => {this.onClose(event)};
    this.socket.onerror = () => {this.onError()};
  }

  addListener(callback) {
    console.log(`add listener: `, callback);
    this.listeners.push(callback)
  }

  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  updateStatus(ready) {
    // console.log(`updateStatus: `, ready);
    this.ready = ready;
    this.listeners.forEach((callback) => {
      callback(this.ready);
    });
  }

  onOpen() {
    console.log(`Websocket: onOpen() >> `);
    // this.ready = true;
    this.updateStatus(true);
  }

  onMessage(event) {
    console.log(`Websocket: onOpen() >> `);
    console.log(`ws: `, event);
    // this.wsStatusTimeout && clearTimeout(this.wsStatusTimeout);
    // this.ready = true;
    this.updateStatus(true);
  }

  onClose(event) {
    console.log(`Websocket: onClose() >> `);
    console.log(event);
    // this.ready = false;
    this.updateStatus(false);
    this.reconnect();
  }
  
  onError() {
    console.log(`Websocket: onError() >> `);
    // this.ready = false;
    this.updateStatus(false);
    // this.reconnect();
  }

  reconnect() {
    console.log(`Websocket: reconnect()`);
    setTimeout(() => {
      console.log('Retrying connection...');
      this.initWebsocket(this.controller.params.url, this.controller.params.jwt);
    }, this.retryInterval);
  }
}