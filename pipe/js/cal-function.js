export default class CalFunction {
  constructor() {}
  
  calculate(nodeArray, edgeArray) {
    // --- helpers ---
    const nodeById = {};
    nodeArray.forEach(n => nodeById[n.id] = n);

    // build undirected adjacency with references to edge entries
    const adj = {};
    nodeArray.forEach(n => adj[n.id] = []);
    edgeArray.forEach((e, idx) => {
      // store edge index to allow finding edge object later
      if (!adj[e.from]) adj[e.from] = [];
      if (!adj[e.to]) adj[e.to] = [];
      adj[e.from].push({ id: e.to, edgeIndex: idx });
      adj[e.to].push({ id: e.from, edgeIndex: idx });
    });

    // find pump (root)
    const pumps = nodeArray.filter(n => n.type === 'pump');
    if (pumps.length === 0) {
      throw new Error('No pump node found.');
    }
    const rootId = pumps[0].id;

    // BFS from root to determine parent and depth (tree orientation)
    const parent = {};     // parent[childId] = parentId
    const depth = {};      // depth[nodeId] = level (root = 0)
    const visited = new Set();
    const q = [rootId];
    visited.add(rootId);
    parent[rootId] = null;
    depth[rootId] = 0;
    while (q.length) {
      const u = q.shift();
      const neighbors = adj[u] || [];
      neighbors.forEach(nb => {
        if (!visited.has(nb.id)) {
          visited.add(nb.id);
          parent[nb.id] = u;
          depth[nb.id] = depth[u] + 1;
          q.push(nb.id);
        }
      });
    }

    // children map (directed from root)
    const childrenMap = {};
    nodeArray.forEach(n => childrenMap[n.id] = []);
    for (const childId in parent) {
      const p = parent[childId];
      if (p !== null && p !== undefined) childrenMap[p].push(childId);
    }

    // post-order compute node flows (L/hr)
    const nodeFlowLph = {}; // accumulated emission at node (L/hr)
    function dfsCompute(nodeId) {
      const node = nodeById[nodeId];
      let sum = 0;
      // own emission if sprinkler
      if (node && node.type === 'sprinkler') {
        sum += Number(node.emission || 0);
      }
      // children
      const childs = childrenMap[nodeId] || [];
      for (const c of childs) {
        sum += dfsCompute(c);
      }
      nodeFlowLph[nodeId] = sum;
      return sum;
    }
    dfsCompute(rootId);

    // Hazen-Williams parameters table
    const C_table = {
      pvc: 150,
      hdpe: 140,
      pe: 140,
      steel: 120,
      concrete: 100,
      // default if material key unknown
    };

    // Hazen–Williams: hf (m) = 10.67 * L * Q^1.852 / (C^1.852 * d^4.87)
    // Q in m^3/s (we store nodeFlowLph in L/hr -> convert to m^3/s)
    function calcHazenWilliams_hf(flow_lph, diameter_mm, length_m, material) {
      if (!flow_lph || flow_lph <= 0) return 0;
      const C = C_table[(material || '').toLowerCase()] || 140;
      const Q_m3s = (flow_lph / 3600) / 1000; // L/hr -> L/s -> m^3/s
      const d_m = (diameter_mm || 0) / 1000;
      if (d_m <= 0 || Q_m3s <= 0) return 0;
      const hf = 10.67 * length_m * Math.pow(Q_m3s, 1.852) /
              (Math.pow(C, 1.852) * Math.pow(d_m, 4.87));
      return hf;
    }

    // For each edge, determine child side and set flow & hloss
    edgeArray.forEach(e => {
      // default values
      e.flow = 0;
      e.hloss = 0;

      // possible orientations:
      // case A: parent[to] === from  => flow is nodeFlowLph[to], direction from->to
      // case B: parent[from] === to  => flow is nodeFlowLph[from], direction to->from
      // else: not a tree edge — choose orientation by deeper node (higher depth)
      const from = e.from, to = e.to;
      let childId = null, parentId = null;

      if (parent[to] === from) {
        childId = to; parentId = from;
      } else if (parent[from] === to) {
        childId = from; parentId = to;
      } else {
        // non-tree edge: try to use depth (if BFS reached both)
        const dFrom = (depth[from] !== undefined) ? depth[from] : -1;
        const dTo = (depth[to] !== undefined) ? depth[to] : -1;
        if (dFrom >= 0 && dTo >= 0) {
          if (dFrom > dTo) { childId = from; parentId = to; }
          else if (dTo > dFrom) { childId = to; parentId = from; }
          else {
            // same depth -> ambiguous (cross link). conservative: set to 0
            childId = null;
          }
        } else if (dFrom >= 0 && dTo < 0) {
          // only from side reachable from pump -> treat to as parent (edge points outward) => child is from
          childId = from; parentId = to;
        } else if (dTo >= 0 && dFrom < 0) {
          childId = to; parentId = from;
        } else {
          childId = null;
        }
      }

      if (childId) {
        const f = nodeFlowLph[childId] || 0;
        e.flow = f; // L/hr
        // compute hloss
        const dia = e.diameter || (nodeById[childId] && nodeById[childId].diameter) || 32;
        const L = (e.length != null) ? e.length : ((nodeById[childId]&&nodeById[childId].length) || 1);
        const mat = e.material || (nodeById[childId] && nodeById[childId].material) || 'hdpe';
        e.hloss = calcHazenWilliams_hf(f, dia, L, mat);
      } else {
        // ambiguous edge not oriented in tree: leave 0 (or optionally compute average)
        e.flow = 0;
        e.hloss = 0;
      }
    });

    // return summary for convenience
    return {
      rootId,
      nodeFlowLph,
      edgeArray
    };
  }
}