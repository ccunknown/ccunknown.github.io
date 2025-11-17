import ToolbarFunction from "./toolbar-function.js";
import CanvasDrawer from "./canvas-drawer.js";

class Main {
  constructor() {
    this.nodeArray = [];
    this.edgeArray = [];
    
    this.toolbarFunction = new ToolbarFunction(
      this.nodeArray,
      this.edgeArray,
      this
    );
    this.toolbarFunction.init();
    this.canvasDrawer = new CanvasDrawer(
      this.nodeArray,
      this.edgeArray,
      this.toolbarFunction
    );
    this.canvasDrawer.init();
  }
}

const main = new Main();

// let idCount = 1;

// let tool = 'node'; // node, edge, move, delete
// let selectedNode = null;
// let connectingFrom = null;
// let dragOffset = null;

// // UI refs
// const btnNode = document.getElementById('tool-node');
// const btnEdge = document.getElementById('tool-edge');
// const btnMove = document.getElementById('tool-move');
// const btnDelete = document.getElementById('tool-delete');
// const btnExport = document.getElementById('btn-export');
// const btnExportTree = document.getElementById('btn-export-tree');
// const btnClear = document.getElementById('btn-clear');
// const btnSetPump = document.getElementById('btn-set-pump');
// const btnSetSprinkler = document.getElementById('btn-set-sprinkler');

// const selId = document.getElementById('selId');
// const selPos = document.getElementById('selPos');
// const inpDia = document.getElementById('inpDia');
// const inpLen = document.getElementById('inpLen');
// const inpType = document.getElementById('inpType');
// const inpFlow = document.getElementById('inpFlow');
// const btnApply = document.getElementById('btn-apply');
// const btnCalcLen = document.getElementById('btn-calclen');
// const jsonOut = document.getElementById('jsonOut');
// const treeOut = document.getElementById('treeOut');

// btnExport.onclick = ()=>{ jsonOut.value = JSON.stringify({nodes,edges},null,2); };
// btnExportTree.onclick = ()=>{
//   const pump = findPump(); 
//   if(!pump){ 
//     alert('Please set a pump node first (select node and click Set as Pump).'); 
//     return; 
//   } 
//   const graph = buildAdjacency(pump); 
//   const tree = convertToBinaryLC_RS(graph, pump.id); 
//   treeOut.value = JSON.stringify(tree,null,2); 
// };
// btnClear.onclick = ()=>{ 
//   if(confirm('Clear everything?')){ 
//     nodes=[]; 
//     edges=[]; 
//     idCount=1; 
//     selectedNode=null; 
//     jsonOut.value=''; 
//     treeOut.value=''; 
//     redraw(); 
//   } 
// };

// btnApply.onclick = ()=>{
//   if(!selectedNode) return;
//   selectedNode.diameter = parseFloat(inpDia.value)||selectedNode.diameter;
//   selectedNode.length = parseFloat(inpLen.value)||selectedNode.length;
//   selectedNode.type = inpType.value || selectedNode.type;
//   selectedNode.flow = (inpFlow.value==='')?selectedNode.flow:parseFloat(inpFlow.value)||0;
//   redraw();
// };
// btnCalcLen.onclick = ()=>{
//   if(!selectedNode) return;
//   const connected = edges.filter(e=>e.from===selectedNode.id||e.to===selectedNode.id);
//   if(connected.length===0){ alert('No connected edges'); return; }
//   let sum=0;
//   connected.forEach(e=>{
//     const otherId = (e.from===selectedNode.id)?e.to:e.from;
//     const o = nodes.find(n=>n.id===otherId);
//     if(o) sum += distance(selectedNode,o);
//   });
//   selectedNode.length = +(sum/connected.length/gridSize).toFixed(2);
//   inpLen.value = selectedNode.length;
//   redraw();
// };

// window.addEventListener('resize', resizeCanvas);
// resizeCanvas();

// // expose debug
// window.__debug = { nodes, edges, redraw, buildAdjacency, convertToBinaryLC_RS };

// redraw();
