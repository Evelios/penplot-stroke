"use strict";

// Colors
const bgColor = tinycolor("#303030");
const bgAccent = tinycolor("#393939");
const primaryColor = tinycolor("#AA7539");
const secondaryColor = tinycolor("#A23645");
const tertiaryColor = tinycolor("#27566B");
const quaternaryColor = tinycolor("#479030");

// Globals
let width;
let height;
let bbox;
let path;
let stroke_paths;

let params = {
    // Parameters

    // Options
};

function setup() {
    width = document.body.clientWidth || window.innerWidth;
    height = document.body.clientHeight || window.innerHeight;
    bbox = [width, height];

    createCanvas(width, height);

    setUpGui();
    createAndRender();
}

function setUpGui() {
    const gui = new dat.GUI();

    // gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(createAndRender);
    // gui.add(params, "density", 15, 50, 1).name("Point Density").onChange(createAndRender);
    // gui.add(params, "jitter", 0, 2, 0.1).name("Point Jitter").onChange(createAndRender);
    // gui.add(params, "distribution", params.distributions).name("Distribution").onChange(createAndRender);
}

function createAndRender() {
    create();
    render();
}

function create() {
    path = [
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
    ];

    stroke_paths = createStroke(path, 10, 1);
}

function render() {
    background(bgColor.toHexString());

    strokeWeight(1);
    stroke(primaryColor.toHexString());
    for (const stroke_path of stroke_paths) {
        for (let i = 0; i < stroke_path.length - 1; i++) {
            const p1 = stroke_path[i];
            const p2 = stroke_path[i + 1];
            line(p1[0], p1[1], p2[0], p2[1]);
        }
    }

    strokeWeight(2);
    stroke(tertiaryColor.toHexString());
    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        line(p1[0], p1[1], p2[0], p2[1]);
    }
}

//---- Helper Functions ----
function pointInBbox() {
    const padding = 50;
    return [
        padding + Math.round(Math.random() * (bbox[0] - padding * 2)),
        padding + Math.round(Math.random() * (bbox[1] - padding * 2))
    ];
}