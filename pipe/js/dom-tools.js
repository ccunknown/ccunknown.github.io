const domTools = {
  main: {
    // select: document.getElementById(`tool-select`),
    node: document.getElementById(`tool-node`),
    edge: document.getElementById(`tool-edge`),
    // move: document.getElementById(`tool-move`),
    delete: document.getElementById(`tool-delete`),
  },
  trig: {
    calculate: document.getElementById(`btn-calculate`),
    export: document.getElementById(`btn-export`),
    import: document.getElementById(`btn-import`),
    clear: document.getElementById(`btn-clear`),
    upload: document.getElementById(`input-upload`),
  },
  selected: {
    apply: document.getElementById(`btn-apply`),
    cancel: document.getElementById(`btn-cancel`),
    delete: document.getElementById(`btn-delete`),
    type: document.getElementById(`label-selected-type`),
    tab: {
      type: {
        node: document.getElementById(`tab-type-node`),
        edge: document.getElementById(`tab-type-edge`),
      }
    },
    node: {
      id: document.getElementById(`label-node-id`),
      name: document.getElementById(`input-node-name`),
      position: document.getElementById(`label-node-position`),
      setas: {
        pump: document.getElementById(`btn-node-type-pump`),
        junction: document.getElementById(`btn-node-type-junction`),
        sprinkler: document.getElementById(`btn-node-type-sprinkler`),
      },
      emission: document.getElementById(`input-sprinkler-emission`),
      tab: {
        type: {
          pump: document.getElementById(`tab-node-type-pump`),
          junction: document.getElementById(`tab-node-type-junction`),
          sprinkler: document.getElementById(`tab-node-type-sprinkler`),
        },
      },
    },
    edge: {
      from: document.getElementById(`label-edge-from`),
      to: document.getElementById(`label-edge-to`),
      flow: document.getElementById(`label-edge-flow`),
      hloss: document.getElementById(`label-edge-hloss`),
      diameter: document.getElementById(`input-edge-diameter`),
      length: document.getElementById(`input-edge-length`),
      setas: {
        pvc: document.getElementById(`btn-edge-material-pvc`),
        hdpe: document.getElementById(`btn-edge-material-hdpe`),
        steel: document.getElementById(`btn-edge-material-steel`),
      },
      tab: {
        material: {
          hdpe: document.getElementById(`tab-edge-material-hdpe`),
          pvc: document.getElementById(`tab-edge-material-pvc`),
          steel: document.getElementById(`tab-edge-material-steel`),
        },
      },
    },
  },
};

export default domTools;