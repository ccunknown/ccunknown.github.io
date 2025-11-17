export default class CanvasDrawer {
  constructor(nodeArr, edgeArr, toolbarFunction) {
    this.op = {
      grid: {
        size: 10,
      },
      node: {
        radius: 4,
      },
      edge: {
        lineWidth: {
          min: 2,
          max: 8,
        },
        selectRadius:8,
      },
      idCount: 1,
    };
    this.nodeArray = nodeArr;
    this.edgeArray = edgeArr;
    this.toolbarFunction = toolbarFunction;
    console.log(`CanvasDrawer.toolbarFunction: `, this.toolbarFunction);
    this.canvas = document.getElementById('draw');
    this.ctx = this.canvas.getContext('2d');
    this.panel = document.getElementById('canvasPanel');
    this.dragOffset = null;
    this.connectingFrom = null;
  }

  init() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('click', this.onClickSelect.bind(this));

    window.addEventListener('resize', this.resizeCanvas.bind(this));
    this.resizeCanvas();
  }

  onPointerDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sx = this.snap(x), sy = this.snap(y);

    if (this.toolbarFunction.selectedMainTool === `node`) {
      console.log(`pointer down (node)`);
      const existing = this.getNodeAt(sx,sy);
      if (existing) {
        this.toolbarFunction.selectNode(existing.id);
        this.dragOffset = { dx: sx - existing.x, dy: sy - existing.y };
        return;
      }
      else {
        const id = `${this.op.idCount++}`;
        const n = {
          id: id,
          name: `N${id}`,
          x: sx,
          y: sy,
          type: `junction`,
          emission: 0,
        };
        this.nodeArray.push(n);
        this.toolbarFunction.selectObj(this.nodeArray.find(e => e.id === id), `node`);
        this.redraw();
        this.toolbarFunction.selectObj()
      }

    } else if (this.toolbarFunction.selectedMainTool === `edge`){
      const node = this.getNodeAt(sx,sy);
      if(node){
        if (!this.connectingFrom) {
          console.log(`1st point`);
          this.connectingFrom = node;
        }
        else {
          console.log(`2nd point`);
          if(this.connectingFrom.id !== node.id){
            // create edge if not exists
            let edge = this.edgeArray.find(e => 
                (e.from === this.connectingFrom.id && e.to === node.id) || 
                (e.from === node.id && e.to === this.connectingFrom.id));
            if(!edge) {
              this.edgeArray.push({
                from: this.connectingFrom.id,
                to: node.id,
                diameter: Math.min(
                  this.connectingFrom.diameter || 32,
                  node.diameter||32
                ),
                length: +(this.distance(this.connectingFrom, node)/this.op.grid.size).toFixed(2),
                material: `hdpe`,
                flow: 0,
                hloss: 0,
              });
              edge = this.edgeArray.at(-1)
            }
            this.toolbarFunction.selectObj(edge);
          }
          this.connectingFrom = null;
          this.redraw();
        }
      }
      else {
        const edge = this.getEdgeAt(sx, sy);
        if (edge) {
          this.toolbarFunction.selectObj(edge, `edge`);
        }
      }
    }
    // else if(this.toolbarFunction.selectedMainTool === `move`){
    //   const hit = this.getNodeAt(sx,sy);
    //   if(hit){
    //     this.toolbarFunction.selectObj(hit, `node`);
    //     this.dragOffset = { dx: sx - hit.x, dy: sy - hit.y };
    //     // applyInspector();
    //   }
    // }
    else if(this.toolbarFunction.selectedMainTool === `delete`){
      const node = this.getNodeAt(sx,sy);
      if(node){
        if(confirm(`Delete ${node.id} and its edges?`)) {
          this.nodeArray.splice(this.nodeArray.indexOf(node),1);
          // this.nodeArray = this.nodeArray.filter(n=>n.id!==node.id);
          const tmpEdge = this.edgeArray.filter(e => 
            [e.from, e.to].includes(node.id)
          );
          tmpEdge.forEach(e => this.edgeArray.splice(
            this.edgeArray.indexOf(e),
            1
          ));
          this.redraw();
        }
        return ;
      }
      const edge = this.getEdgeAt(sx, sy);
      if(edge) {
        if(confirm(`Delete edge from ${edge.from} to ${edge.to} ?`)) {
          this.edgeArray.splice(this.edgeArray.indexOf(edge, 1));
          this.redraw();
        }
      }
    }
  }

  onPointerMove(e){
    if (
      [`node`].includes(this.toolbarFunction.selectedMainTool)
      && this.dragOffset
      && this.toolbarFunction.selectedObjType === `node`
    ) {
      const rect = this.canvas.getBoundingClientRect();
      const sx = this.snap(e.clientX - rect.left - this.dragOffset.dx);
      const sy = this.snap(e.clientY - rect.top - this.dragOffset.dy);
      const selectedNode = this.toolbarFunction.selectedObj;
      selectedNode.x = sx; selectedNode.y = sy;
      // selPos.innerText = `${selectedNode.x}, ${selectedNode.y}`;
      this.toolbarFunction.selectNode(selectedNode.id);
      // this.redraw();
    }
  }

  onPointerUp(e){
    this.dragOffset = null;
  }

  onClickSelect(ev){
    const rect = this.canvas.getBoundingClientRect();
    const sx = this.snap(ev.clientX - rect.left);
    const sy = this.snap(ev.clientY - rect.top);
    const nodeHit = this.getNodeAt(sx,sy);
    const edgeHit = this.getEdgeAt(sx,sy);
    console.log(`node hit: `, nodeHit);
    console.log(`edge hit: `, edgeHit);
    // selectNode(nodeHit || edgeHit || null);
    if (nodeHit && this.toolbarFunction.selectedMainTool !== `edge`) 
      this.toolbarFunction.selectObj(nodeHit, `node`);
    else if (edgeHit)
      this.toolbarFunction.selectObj(edgeHit, `edge`);
  }

  snap(v) { return Math.round(v/this.op.grid.size)*this.op.grid.size; }

  distance(a,b) { return Math.hypot(a.x-b.x,a.y-b.y); }
  
  getNodeAt(x,y) {
    return this.nodeArray.find(n => {
      return Math.hypot(n.x-x,n.y-y) <= this.op.node.radius + 4;
    });
  }

  getEdgeAt(x,y) {
    const r = this.op.edge.selectRadius;
    return this.edgeArray.find( n => {
      const a = this.nodeArray.find((e) => e.id === n.from);
      const b = this.nodeArray.find((e) => e.id === n.to);
      const res = this.isLineIntersectsCircle([a.x, a.y], [b.x, b.y], [x, y], r);
      console.log(`getEdgeAt [`, x, `,` ,y, `]: `, res);
      return res;
    });
  }

  isLineIntersectsCircle(A, B, C, r) {
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

  redraw() {
    // adjust canvas pixel size to container
    const w = this.panel.clientWidth - 24;
    const h = this.panel.clientHeight - 24;
    const deviceRatio = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(600, Math.floor(w * deviceRatio));
    this.canvas.height = Math.max(400, Math.floor(h * deviceRatio));
    this.canvas.style.width = Math.max(600, w) + 'px';
    this.canvas.style.height = Math.max(400, h) + 'px';
    this.ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawEdges();
    this.drawNodes();
  }

  resizeCanvas() {
    this.redraw();
  }

  drawGrid() {
    const w = this.canvas.width / (window.devicePixelRatio || 1);
    const h = this.canvas.height / (window.devicePixelRatio || 1);
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255,255,255,0.01)';
    this.ctx.fillRect(0,0,w,h);
    this.ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    this.ctx.lineWidth = 1;
    for(let x = 0; x < w; x += this.op.grid.size) {
      this.ctx.beginPath();
      this.ctx.moveTo(x+0.5, 0);
      this.ctx.lineTo(x+0.5,h);
      this.ctx.stroke();
    }
    for(let y = 0; y < h; y += this.op.grid.size) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(w, y + 0.5);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawEdges() {
    console.log(`edge array: `, this.edgeArray);
    this.edgeArray.forEach(e => {
      const a = this.nodeArray.find(n => n.id === e.from);
      const b = this.nodeArray.find(n => n.id === e.to);
      if(!a || !b) return;
      this.ctx.beginPath();
      this.ctx.moveTo(a.x,a.y);
      this.ctx.lineTo(b.x,b.y);
      this.ctx.strokeStyle = 'rgba(56,189,248,0.9)';
      this.ctx.lineWidth = Math.max(
        this.op.edge.lineWidth.min, 
        Math.min(
          this.op.edge.lineWidth.max, 
          e.diameter/25
        )
      );
      this.ctx.stroke();

      // label length/dia
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const lbl = `${(e.length || '')}m / ${(e.diameter || '')}mm`;
      const lbc = `${(e.flow || '')}L/h, ${(Number(e.hloss).toFixed(4) || '')}m`;
      this.ctx.fillStyle = '#a5f3fc';
      this.ctx.font = '11px Arial';
      this.ctx.fillText(lbl, mx + 6, my - 6);
      if (e.flow || e.hloss)
        this.ctx.fillText(lbc, mx + 6, my + 10);
    });
  }

  drawNodes(){
    console.log(`node array: `, this.nodeArray);
    this.nodeArray.forEach(n => {
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, this.op.node.radius, 0, Math.PI*2);
      if(n.type === 'pump')
        this.ctx.fillStyle = '#e9910eff';
      else if(n.type==='sprinkler')
        this.ctx.fillStyle = '#10b981';
      else
        this.ctx.fillStyle = '#0369a1';
      this.ctx.fill();

      this.ctx.fillStyle = '#fff';
      this.ctx.font = '10px Arial';
      if(n.type !== `junction`)
        this.ctx.fillText(n.name, n.x+10, n.y+4);

      // if sprinkler, show flow
      if(n.type === `sprinkler` && n.emission) {
        this.ctx.fillStyle = '#d1fae5';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`${n.emission} L/hr`, n.x+10, n.y+18);
      }
    });
  }
}
