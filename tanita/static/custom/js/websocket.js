export default class Websocket {
  constructor(controller) {
    this.controller = controller;
    this.ready = false;
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

  onOpen() {
    console.log(`Websocket: onOpen() >> `);
    this.ready = true;
  }

  onMessage(event) {
    console.log(`Websocket: onOpen() >> `);
    console.log(event);
  }

  onClose(event) {
    console.log(`Websocket: onClose() >> `);
    console.log(event);
  }

  onError() {
    console.log(`Websocket: onError() >> `);
  }
}