// main.js - interactive pipe network drawer + graph -> LC-RS binary tree export

const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');
const panel = document.getElementById('canvasPanel');

const op = {
  edge: {
    lineWidth: {
      min: 2,
      max: 8
    },
    selectRadius: 8,
  },
};

const gridSize = 10;
const nodeRadius = 4;

let nodes = []; // {id,x,y,type,diameter,length,flow}
let edges = []; // {from,to,diameter,length}
let idCount = 1;

let tool = 'node'; // node, edge, move, delete
let selectedNode = null;
let connectingFrom = null;
let dragOffset = null;

// UI refs
const btnNode = document.getElementById('tool-node');
const btnEdge = document.getElementById('tool-edge');
const btnMove = document.getElementById('tool-move');
const btnDelete = document.getElementById('tool-delete');
const btnExport = document.getElementById('btn-export');
const btnExportTree = document.getElementById('btn-export-tree');
const btnClear = document.getElementById('btn-clear');
const btnSetPump = document.getElementById('btn-set-pump');
const btnSetSprinkler = document.getElementById('btn-set-sprinkler');

const selId = document.getElementById('selId');
const selPos = document.getElementById('selPos');
const inpDia = document.getElementById('inpDia');
const inpLen = document.getElementById('inpLen');
const inpType = document.getElementById('inpType');
const inpFlow = document.getElementById('inpFlow');
const btnApply = document.getElementById('btn-apply');
const btnCalcLen = document.getElementById('btn-calclen');
const jsonOut = document.getElementById('jsonOut');
const treeOut = document.getElementById('treeOut');

function setTool(t){
  tool = t;
  [btnNode,btnEdge,btnMove,btnDelete].forEach(b=>b.classList.remove('active'));
  if(t==='node') btnNode.classList.add('active');
  if(t==='edge') btnEdge.classList.add('active');
  if(t==='move') btnMove.classList.add('active');
  if(t==='delete') btnDelete.classList.add('active');
  connectingFrom = null;
}
btnNode.onclick = ()=>setTool('node');
btnEdge.onclick = ()=>setTool('edge');
btnMove.onclick = ()=>setTool('move');
btnDelete.onclick = ()=>setTool('delete');

btnExport.onclick = ()=>{ jsonOut.value = JSON.stringify({nodes,edges},null,2); };
btnExportTree.onclick = ()=>{ const pump = findPump(); if(!pump){ alert('Please set a pump node first (select node and click Set as Pump).'); return; } const graph = buildAdjacency(pump); const tree = convertToBinaryLC_RS(graph, pump.id); treeOut.value = JSON.stringify(tree,null,2); };
btnClear.onclick = ()=>{ if(confirm('Clear everything?')){ nodes=[]; edges=[]; idCount=1; selectedNode=null; jsonOut.value=''; treeOut.value=''; redraw(); } };

btnSetPump.onclick = ()=>{
  if(!selectedNode) { alert('Select a node first (click on a node).'); return; }
  // ensure single pump
  nodes.forEach(n=>{ if(n.type==='pump') n.type='pipe'; });
  selectedNode.type = 'pump';
  selectedNode.flow = 0;
  applyInspector();
  redraw();
};
btnSetSprinkler.onclick = ()=>{
  if(!selectedNode) { alert('Select a node first (click on a node).'); return; }
  const f = parseFloat(prompt('Flow rate (L/hr) for this sprinkler:', selectedNode.flow || 100));
  if(Number.isFinite(f)) selectedNode.flow = f;
  selectedNode.type = 'sprinkler';
  applyInspector();
  redraw();
};

btnApply.onclick = ()=>{
  if(!selectedNode) return;
  selectedNode.diameter = parseFloat(inpDia.value)||selectedNode.diameter;
  selectedNode.length = parseFloat(inpLen.value)||selectedNode.length;
  selectedNode.type = inpType.value || selectedNode.type;
  selectedNode.flow = (inpFlow.value==='')?selectedNode.flow:parseFloat(inpFlow.value)||0;
  redraw();
};
btnCalcLen.onclick = ()=>{
  if(!selectedNode) return;
  const connected = edges.filter(e=>e.from===selectedNode.id||e.to===selectedNode.id);
  if(connected.length===0){ alert('No connected edges'); return; }
  let sum=0;
  connected.forEach(e=>{
    const otherId = (e.from===selectedNode.id)?e.to:e.from;
    const o = nodes.find(n=>n.id===otherId);
    if(o) sum += distance(selectedNode,o);
  });
  selectedNode.length = +(sum/connected.length/gridSize).toFixed(2);
  inpLen.value = selectedNode.length;
  redraw();
};

// Canvas events
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('click', onClickSelect);

function snap(v){ return Math.round(v/gridSize)*gridSize; }
function distance(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }
function getNodeAt(x,y){
  return nodes.find(n=>Math.hypot(n.x-x,n.y-y) <= nodeRadius+4);
}
function getEdgeAt(x,y){
  const r = op.edge.selectRadius;
  return edges.find( n => {
    const a = nodes.find((e) => e.id === n.from);
    const b = nodes.find((e) => e.id === n.to);
    const res = lineIntersectsCircle([a.x, a.y], [b.x, b.y], [x, y], r);
    console.log(`getEdgeAt [`, x, `,` ,y, `]: `, res);
    return res;
  });
}

function lineIntersectsCircle(A, B, C, r) {
  const [x1, y1] = A;
  const [x2, y2] = B;
  const [xc, yc] = C;

  // คำนวณค่าของสมการเส้นตรง
  const A_line = y1 - y2;
  const B_line = x2 - x1;
  const C_line = x1 * y2 - x2 * y1;

  // ระยะจากจุดศูนย์กลางวงกลมถึงเส้นตรง
  const d = Math.abs(A_line * xc + B_line * yc + C_line) / Math.sqrt(A_line**2 + B_line**2);

  // ถ้าระยะมากกว่ารัศมี -> ไม่ตัดแน่นอน
  if (d > r)
    return false;

  // คำนวณตำแหน่งจุดฉากบนเส้น AB
  const t = ((xc - x1)*(x2 - x1) + (yc - y1)*(y2 - y1)) / ((x2 - x1)**2 + (y2 - y1)**2);

  // ตรวจสอบว่าจุดฉากอยู่บน segment (0 ≤ t ≤ 1)
  return (t >= 0 && t <= 1);
}

function onPointerDown(e){
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const sx = snap(x), sy = snap(y);

  if(tool==='node'){
    const existing = getNodeAt(sx,sy);
    if(existing){ selectNode(existing); return; }
    const n = { id: 'N'+(idCount++), x: sx, y: sy, diameter: 32, length: 1, type: 'pipe', flow: 0 };
    nodes.push(n);
    selectNode(n);
    redraw();
  } else if(tool==='edge'){
    const hit = getNodeAt(sx,sy);
    if(hit){
      if(!connectingFrom){ connectingFrom = hit; } else {
        if(connectingFrom.id !== hit.id){
          // create edge if not exists
          if(!edges.find(e=> (e.from===connectingFrom.id && e.to===hit.id) || (e.from===hit.id && e.to===connectingFrom.id))){
            edges.push({ from: connectingFrom.id, to: hit.id, diameter: Math.min(connectingFrom.diameter||32, hit.diameter||32), length: +(distance(connectingFrom,hit)/gridSize).toFixed(2) });
          }
        }
        connectingFrom = null;
        redraw();
      }
    }
  } else if(tool==='move'){
    const hit = getNodeAt(sx,sy);
    if(hit){
      selectedNode = hit;
      dragOffset = { dx: sx - hit.x, dy: sy - hit.y };
      applyInspector();
    }
  } else if(tool==='delete'){
    const hit = getNodeAt(sx,sy);
    if(hit){
      if(confirm(`Delete ${hit.id} and its edges?`)){
        nodes = nodes.filter(n=>n.id!==hit.id);
        edges = edges.filter(e=>e.from!==hit.id && e.to!==hit.id);
        if(selectedNode && selectedNode.id===hit.id) selectedNode=null;
        redraw();
      }
    }
  }
}

function onPointerMove(e){
  if(tool==='move' && dragOffset && selectedNode){
    const rect = canvas.getBoundingClientRect();
    const sx = snap(e.clientX - rect.left - dragOffset.dx);
    const sy = snap(e.clientY - rect.top - dragOffset.dy);
    selectedNode.x = sx; selectedNode.y = sy;
    selPos.innerText = `${selectedNode.x}, ${selectedNode.y}`;
    redraw();
  }
}
function onPointerUp(e){
  dragOffset = null;
}

function onClickSelect(ev){
  const rect = canvas.getBoundingClientRect();
  const sx = snap(ev.clientX - rect.left);
  const sy = snap(ev.clientY - rect.top);
  const nodeHit = getNodeAt(sx,sy);
  const edgeHit = getEdgeAt(sx,sy);
  console.log(`node hit: `, nodeHit);
  console.log(`edge hit: `, edgeHit);
  // selectNode(nodeHit || edgeHit || null);
  nodeHit
  ? selectNode(nodeHit)
  : edgeHit
    ? selectEdge(edgeHit)
    : null;
}

function selectNode(n) {
  console.log(`select node: `, n);
  selectedNode = n;
  selId.innerText = n? n.id : '—';
  selPos.innerText = n? `${n.x}, ${n.y}` : '—';
  if(n){
    inpDia.value = n.diameter || '';
    inpLen.value = n.length || '';
    inpType.value = n.type || 'pipe';
    inpFlow.value = n.flow || '';
  } else {
    inpDia.value = ''; inpLen.value=''; inpType.value='pipe'; inpFlow.value='';
  }
  redraw();
}

function selectEdge(n) {
  console.log(`select edge: `, n);
  
}

// draw
function redraw(){
  // adjust canvas pixel size to container
  const w = panel.clientWidth - 24;
  const h = panel.clientHeight - 24;
  const deviceRatio = window.devicePixelRatio || 1;
  canvas.width = Math.max(600, Math.floor(w * deviceRatio));
  canvas.height = Math.max(400, Math.floor(h * deviceRatio));
  canvas.style.width = Math.max(600, w) + 'px';
  canvas.style.height = Math.max(400, h) + 'px';
  ctx.setTransform(deviceRatio,0,0,deviceRatio,0,0);

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawGrid();
  drawEdges();
  drawNodes();

  console.log(`node: `, nodes);
  console.log(`edge:`, edges);
}

function drawGrid(){
  const w = canvas.width / (window.devicePixelRatio||1);
  const h = canvas.height / (window.devicePixelRatio||1);
  ctx.save();
  ctx.fillStyle='rgba(255,255,255,0.01)'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(255,255,255,0.03)'; ctx.lineWidth=1;
  for(let x=0;x<w;x+=gridSize){ ctx.beginPath(); ctx.moveTo(x+0.5,0); ctx.lineTo(x+0.5,h); ctx.stroke(); }
  for(let y=0;y<h;y+=gridSize){ ctx.beginPath(); ctx.moveTo(0,y+0.5); ctx.lineTo(w,y+0.5); ctx.stroke(); }
  ctx.restore();
}

function drawEdges(){
  edges.forEach(e=>{
    const a = nodes.find(n=>n.id===e.from);
    const b = nodes.find(n=>n.id===e.to);
    if(!a||!b) return;
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.strokeStyle = 'rgba(56,189,248,0.9)';
    ctx.lineWidth = Math.max(op.edge.lineWidth.min, Math.min(op.edge.lineWidth.max, e.diameter/25));
    ctx.stroke();

    // label length/dia
    const mx = (a.x + b.x)/2; const my = (a.y + b.y)/2;
    const lbl = `${(e.length||'')}m / ${(e.diameter||'')}mm`;
    ctx.fillStyle='#a5f3fc'; ctx.font='11px Arial'; ctx.fillText(lbl, mx+6, my-6);
  });
}

function drawNodes(){
  nodes.forEach(n=>{
    ctx.beginPath(); ctx.arc(n.x,n.y,nodeRadius,0,Math.PI*2);
    if(n.type==='pump') ctx.fillStyle='#0ea5e9';
    else if(n.type==='sprinkler') ctx.fillStyle='#10b981';
    else ctx.fillStyle='#0369a1';
    ctx.fill();

    ctx.fillStyle='#fff'; ctx.font='10px Arial'; ctx.fillText(n.id, n.x+10, n.y+4);

    // if sprinkler, show flow
    if(n.type==='sprinkler' && n.flow) {
      ctx.fillStyle='#d1fae5'; ctx.font='10px Arial';
      ctx.fillText(`${n.flow} L/hr`, n.x+10, n.y+18);
    }
  });
}

// Graph -> adjacency (directed from pump root)
function findPump(){
  return nodes.find(n=>n.type==='pump') || null;
}

// Build undirected adjacency from nodes/edges, then BFS from pump to produce directed children map
function buildAdjacency(rootNode){
  // create adjacency lists
  const adj = {};
  nodes.forEach(n=> adj[n.id]=[]);
  edges.forEach(e=>{ if(adj[e.from]) adj[e.from].push(e.to); if(adj[e.to]) adj[e.to].push(e.from); });

  // BFS to assign parent-child (direction from root)
  const visited = new Set();
  const q = [rootNode.id];
  visited.add(rootNode.id);
  const parent = {}; parent[rootNode.id] = null;
  const childrenMap = {}; nodes.forEach(n=> childrenMap[n.id] = []);
  while(q.length){
    const u = q.shift();
    const neigh = adj[u] || [];
    neigh.forEach(v=>{
      if(!visited.has(v)){
        visited.add(v);
        parent[v] = u;
        childrenMap[u].push(v);
        q.push(v);
      }
    });
  }

  // build graph map with node data & edge info to child
  const graph = {};
  nodes.forEach(n=>{
    graph[n.id] = {
      id: n.id,
      x: n.x,
      y: n.y,
      diameter: n.diameter,
      length: n.length,
      type: n.type,
      flow: n.flow || 0,
      children: (childrenMap[n.id]||[]).map(cid=>{
        const e = edges.find(ed => (ed.from===n.id && ed.to===cid) || (ed.from===cid && ed.to===n.id));
        return { id: cid, edge: e || null };
      })
    };
  });
  return graph;
}

// Convert general tree graph (children arrays) to binary LC-RS representation recursively
function convertToBinaryLC_RS(graph, rootId){
  function buildNode(id){
    const g = graph[id];
    if(!g) return null;
    const children = g.children || [];
    let left = null;
    if(children.length>0) left = buildNode(children[0].id);
    // chain siblings via right pointers
    let cur = left;
    for(let i=1;i<children.length;i++){
      const sib = buildNode(children[i].id);
      if(cur) cur.right = sib;
      else left = sib;
      cur = sib;
    }
    const nodeObj = {
      id: g.id,
      x: g.x,
      y: g.y,
      diameter: g.diameter,
      length: g.length,
      type: g.type,
      flow: g.flow,
      edgeToParent: null,
      left: left || null,
      right: null
    };
    // find edgeToParent by searching parent's children
    for(const pid in graph){
      const ch = graph[pid];
      if(ch.children.find(c=>c.id===id)){
        nodeObj.edgeToParent = ch.children.find(c=>c.id===id).edge || null;
        break;
      }
    }
    return nodeObj;
  }
  return buildNode(rootId);
}

// window resize / canvas size helper
function resizeCanvas(){
  redraw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// expose debug
window.__debug = { nodes, edges, redraw, buildAdjacency, convertToBinaryLC_RS };

redraw();
