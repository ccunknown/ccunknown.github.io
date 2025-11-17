export default class FileOperator {
  constructor() {}

  exportFile(nodeArray, edgeArray) {
    const blob = new Blob(
      [JSON.stringify({
        nodeArray: nodeArray,
        edgeArray: edgeArray,
      }, null, 2)],
      { type: `application/json` }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement(`a`);
    a.href = url;
    a.download = `hloss-config-${(new Date()).toISOString().split(`T`).shift()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importFile() {
    
  }
}