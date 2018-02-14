export const referentialsGraphModel = {

    // Display metrics
    margins: { top: 0, right: 20, bottom: 20, left: 20 },
    yOffset: 10,  // Adjust y position so text on root node clears left edge
    width: 900,
    height: 750,
    scale: '100%',
    levelDepths: [ 0, +150, +150, +150, +150, +100, +100, +100, +100, +100 ],  // relative spacing
    nodeId: 0,
    innerWidth: null,
    innerHeight: null,

    // Path styles
    circle: {
        radius: '6',
        fill: 'lightsteelblue',
        stroke: 'steelblue',
        strokeWidth: '1.5px'
    },
    text: {
        'fontsize': '10px',
    },
    links: {
        'fill': 'none',
        'stroke': 'rgba(205, 217, 234, 0.3)',
        'strokewidth': '2.5px',
        'showPathText': false,  // Hide/show join key on paths
    },

    // Data loading parameters
    pathToData: '/data/RITree/',
    treeFile: 'structure.json',
    dataFile: 'data.json',

    // objects global to this graph
    svg: null,
    treeMap: null,
    treeData: null,
    rootNode: null,

    // functions
    nodeClick: null,
    duration: null,
    diagonal: null,
};
