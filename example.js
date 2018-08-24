"use strict";

// Colors
const bgColor = tinycolor("#303030");
const bgAccent = tinycolor("#393939");
const primaryColor = tinycolor("#AA7539");
const secondaryColor = tinycolor("#A23645");
const tertiaryColor = tinycolor("#27566B");
const quaternaryColor = tinycolor("#479030");

// Globals
const padding = 100;
let width;
let height;
let bbox;
let path;
let stroke_paths;
let rng;

const params = {
    // Parameters
    seed             : 1,
    line_width       : 20,
    pen_width        : 2,
    draw_width       : 1,
    endcap           : 'none',
    stroke_alignment : 'center',
    corner_style     : 'square',
    line_style       : 'line',
    polygon      : false,
    show_input_line  : true,

    // Options
    endcaps : [
        'none',
        'square',
        'round',
        'triangle',
        'indent',
    ],
    stroke_alignments : [
        'center',
        // 'inset',
        // 'outset',
    ],
    corner_styles : [
        'square',
        // 'round',
        // 'bevel',
    ],
    line_styles : [
        'line',
        // 'dashed',
        // 'dotted',
        // 'dash_dot',
    ],
    line_styles_properties : {
        line     : (() => []),
        dashed   : (() => [this.pen_width, this.pen_width]),
        dotted   : (() => [0, this.pen_width]),
        dash_dot : (() => [this.pen_width, this.pen_width, 0, this.pen_width]),
    }
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

    gui.add(params, "seed", 1, 5, 1).name("RNG Seed").onChange(createAndRender);
    gui.add(params, "line_width", 1, 50, 1).name("Line Thickness").onChange(createAndRender);
    gui.add(params, "pen_width", 1, 10, 1).name("Stroke Width").onChange(createAndRender);
    gui.add(params, "draw_width", 1, 10, 1).name("Drawing width").onChange(createAndRender);
    gui.add(params, "endcap", params.endcaps).name("Stroke Endcap").onChange(createAndRender);
    gui.add(params, "stroke_alignment", params.stroke_alignments).name("Stroke Alignment").onChange(createAndRender);
    gui.add(params, "corner_style", params.corner_styles).name("Stroke Alignment").onChange(createAndRender);
    gui.add(params, "line_style", params.line_styles).name("Line Style").onChange(createAndRender);
    gui.add(params, "polygon").name("Polygon").onChange(createAndRender);
    gui.add(params, "show_input_line").name("Show Input Line").onChange(render);
}

function createAndRender() {
    create();
    render();
}

function create() {
    rng = new Alea(params.seed);

    path = [
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
        pointInBbox(),
        pointInBbox()
    ];


    stroke_paths = createStroke(path, params.line_width, params.pen_width, {
        polygon : params.polygon,
        endcap : params.endcap,
        corner : params.corner_style,
        line_style : params.line_style,
        align_stroke : params.stroke_alignment,
    });
}

function render() {
    background(bgColor.toHexString());

    // Draw the weighted stroke path
    strokeWeight(params.draw_width);
    stroke(primaryColor.toHexString());
    for (const stroke_path of stroke_paths) {
        for (let i = 0; i < stroke_path.length - 1; i++) {
            const p1 = stroke_path[i];
            const p2 = stroke_path[i + 1];
            line(p1[0], p1[1], p2[0], p2[1]);
        }
    }

    // Draw origional line
    if (params.show_input_line) {
        strokeWeight(params.draw_width);
        stroke(tertiaryColor.toHexString());
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            line(p1[0], p1[1], p2[0], p2[1]);
        }
    }
}

//---- Helper Functions ----
function pointInBbox() {
    return [
        padding + Math.round(rng() * (bbox[0] - padding * 2)),
        padding + Math.round(rng() * (bbox[1] - padding * 2))
    ];
}