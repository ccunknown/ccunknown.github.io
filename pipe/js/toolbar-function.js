import domTools from "./dom-tools.js";
import CalFunction from "./cal-function.js"
import FileOperator from "./file-operator.js";

export default class ToolbarFunction {
  constructor(nodeArr, edgeArr, main) {
    this.main = main;
    this.nodeArray = nodeArr;
    this.edgeArray = edgeArr;
    this.calFunction = new CalFunction(this.nodeArray, this.edgeArray);
    this.fileOperator = new FileOperator();
    this.selectedMainTool = `node`;
    this.selectedObj = null;
    this.selectedObjType = null;
    this.connectingFrom = null;
    this.domTools = domTools;
    // console.log(`domTools: `, domTools);
    // this.init();
  }

  init() {
    // Setup main tool DOM listener.

    // Setup MainTool selection function.
    Object.entries(this.domTools.main).forEach(([k, v]) => {
      v.onclick = () => this.setMainToolAs(k);
    });

    // Setup node type selection function.
    Object.entries(this.domTools.selected.node.setas).forEach(([k, v]) => {
      v.onclick = () => this.setNodeTypeAs(k);
    });

    // Setup edge meterial selection function.
    Object.entries(this.domTools.selected.edge.setas).forEach(([k, v]) => {
      v.onclick = () => this.setEdgeMaterialAs(k);
    });

    this.initButtonAction();
    this.initInputChange();
  }

  initButtonAction() {
    const toolTrig = this.domTools.trig;
    toolTrig.calculate.onclick = () => {
      this.calFunction.calculate(this.nodeArray, this.edgeArray);
      this.redraw();
    };
    toolTrig.export.onclick = () => this.fileOperator.exportFile(
      this.nodeArray,
      this.edgeArray
    );
    toolTrig.import.onclick = () => toolTrig.upload.click();
    toolTrig.clear.onclick = () => {
      if (confirm(`All node and pipe will be delete. Are you sure to clear ?`)) {
        if (confirm(`Confirm to delete everthings again.`)) {
          this.clearAll();
        }
      }
    };
    toolTrig.upload.onchange = (event) => {
      const file = event.target.files[0];
      if (!file)
        return ;
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const content = readerEvent.target.result;
        try {
          const json = JSON.parse(content);
          if(Array.isArray(json.nodeArray) && Array.isArray(json.edgeArray)) {
            this.clearAll();
            json.nodeArray.forEach(e => this.nodeArray.push(e));
            json.edgeArray.forEach(e => this.edgeArray.push(e));
            // Setup idCounter;
            let counter = 0
            this.nodeArray.forEach(n => {
              let nid = Number(n.id);
              if (nid > counter)
                counter = nid;
            });
            this.setIdCounter(counter + 1);
            this.redraw();
          }
          else {
            throw new Error(`Wrong file structure.`);
          }
        } catch(e) {
          console.error(e);
          alert(`Wrong file format!`);
        }
        console.log(content);
      };
      reader.readAsText(file);
    };
  }

  initInputChange() {
    const toolSelNode = this.domTools.selected.node;
    Object.entries(toolSelNode).forEach(([k, v]) => {
      if (v.tagName === `INPUT`) {
        v.addEventListener(`input`, () => {
          this.selectedObj[k] = v.type === `number` ? Number(v.value) : value;
          this.redraw();
        });
      }
    });

    const toolSelEdge = this.domTools.selected.edge;
    Object.entries(toolSelEdge).forEach(([k, v]) => {
      if (v.tagName === `INPUT`) {
        v.addEventListener(`input`, () => {
          this.selectedObj[k] = v.value;
          this.redraw();
        });
      }
    });
  }

  setMainToolAs(t) {
    console.log(`setMainToolAs(${t})`);
    Object.entries(this.domTools.main).forEach(([k, v]) => {
      (t === k) ? v.classList.add(`active`) : v.classList.remove(`active`);
    });
    this.selectedMainTool = t;

    // Specific tool additional requirement.
    if (t === `delete`) {
      this.selectObj(null);
    }
  }

  setNodeTypeAs(t) {
    console.log(`setNodeTypeAs(${t})`);
    const domNode = this.domTools.selected.node;
    Object.entries(domNode.setas).forEach(([k, v]) => {
      (t === k) ? v.classList.add(`active`) : v.classList.remove(`active`);
    });
    Object.entries(domNode.tab.type).forEach(([k, v]) => {
      (t === k.split(`-`).shift()) ? v.classList.remove(`hide`) : v.classList.add(`hide`);
    });
    this.selectedObj.type = t;
    this.redraw();
  }

  setEdgeMaterialAs(t) {
    console.log(`setEdgeMaterialAs(${t})`);
    const domSelEdge = this.domTools.selected.edge;
    Object.entries(domSelEdge.setas).forEach(([k, v]) => {
      (t === k) ? v.classList.add(`active`) : v.classList.remove(`active`);
    });
    Object.entries(domSelEdge.tab.material).forEach(([k, v]) => {
      (t === k.split(`-`).shift()) ? v.classList.remove(`hide`) : v.classList.add(`hide`);
    });
    this.selectedObj.material = t;
    this.redraw();
    // this.selectedObj.type = `edge`;
  }

  selectObj(obj, type) {
    if (obj === null)
      type = null;
    this.selectedObj = obj;
    this.selectedObjType = type;
    if (type === `node`)
      this.onSelectNode();
    if (type === `edge`)
      this.onSelectEdge();
    Object.entries(this.domTools.selected.tab.type).forEach(([k, v]) => {
      (type === k)
        ? this.domTools.selected.tab.type[k].classList.remove(`hide`)
        : this.domTools.selected.tab.type[k].classList.add(`hide`);
    });
    this.redraw();
  }

  selectNode(node = this.selectObj) {
    if (typeof node === `string`)
      node = this.nodeArray.find(n => n.id === node);
    this.selectedObj = node;
    this.selectedObjType = `node`;
    this.onSelectNode(node);
    this.redraw();
  }

  onSelectNode(node = this.selectedObj) {
    this.selectedObjType = `node`;
    this.domTools.selected.type.innerHTML = `Node`;
    const domNode = this.domTools.selected.node;
    domNode.id.innerHTML = node.id;
    domNode.name.value = node.name;
    domNode.position.innerHTML = `${node.x},${node.y}`;
    domNode.emission.value = node.emission
    Object.entries(domNode.setas).forEach(([k, v]) => {
      (node.type === k)
        ? v.classList.add(`active`)
        : v.classList.remove(`active`);
    });
    Object.entries(domNode.tab.type).forEach(([k, v]) => {
      (node.type === k)
        ? v.classList.remove(`hide`)
        : v.classList.add(`hide`);
    });
  }

  selectEdge(...args) {
    const edge = (args.length === 2)
      ? this.edgeArray.find(e => {
          (e.from === args[0] && e.to === args[1]) ||
          (e.from === args[1] && e.to === args[0])
        })
      : args[0];
    this.onSelectEdge(edge);
    this.redraw();
  }

  onSelectEdge(e = this.selectedObj) {
    this.domTools.selected.type.innerHTML = `Edge`;
    const domEdge = this.domTools.selected.edge;
    domEdge.from.innerHTML = e.from;
    domEdge.to.innerHTML = e.to;
    domEdge.diameter.value = e.diameter;
    domEdge.length.value = e.length;
    domEdge.flow.innerHTML = e.flow;
    domEdge.hloss.innerHTML = e.hloss;
    Object.entries(domEdge.tab.material).forEach(([k, v]) => {
      (e.material === k)
        ? v.classList.add(`active`)
        : v.classList.remove(`active`);
    });
  }

  onApply() {
    console.log(`onApply()`);
    if (!this.selectObj || !this.selectedObjType) return;
    
    const sel = this.selectedObj;
    const typ = this.selectedObjType;
    
    if (typ === `node`) {
      console.log(`save node: `, sel);
      const dom = this.domTools.selected.node;
      sel.id = dom.id.innerHTML;
      sel.name = dom.name.value;
      sel.type = Object.entries(dom.setas).find(([k, v]) => {
        return v.classList.contains(`active`);
      })[0];
      sel.emission = (sel.type === `sprinkler`)
        ? Number(dom.emission.value)
        : 0;
      console.log(`seledted obj: `, sel);
    }
    
    else if (typ === `edge`) {
      console.log(`save edge: `, sel);
      const dom = this.domTools.selected.edge;
      sel.length = Number(dom.length.value);
      sel.diameter = Number(dom.diameter.value);
      sel.type = Object.entries(dom.setas).find(([k, v]) => {
        return v.classList.contains(`active`);
      })[0];
      sel.flow = 0;
      sel.hloss = 0;
      console.log(`seledted obj: `, sel);
    }

    this.redraw();
  }

  clearAll() {
    this.nodeArray.splice(0, this.nodeArray.length);
    this.edgeArray.splice(0, this.edgeArray.length);
    this.resetIdCount();
    this.redraw();
  }

  redraw() {
    this.main.canvasDrawer.redraw();
  }

  getIdCounter() {
    return this.main.canvasDrawer.op.idCount;
  }

  resetIdCount() {
    this.main.canvasDrawer.op.idCount = 1;
  }

  setIdCounter(num) {
    this.main.canvasDrawer.op.idCount = num;
  }

  getSelectedMainTool() {
    return this.selectedMainTool;
  }
}