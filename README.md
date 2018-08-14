# penplot-stroke
A helper algorithm for pen plotting strokes with variable thicknesses and properties based off a fixed pen tip size

## Usage

The input is a path in list form  
```js
const input_path = [ [x1, y1], [x2, y2], [x3, y3], ... ];
```
The output is a series of paths in list form like above
```js
const output_paths = [
  path1,
  path2,
  path3
];
```

```js
// Include with ES 6
import createStroke from 'penplot-stroke';

// Include in Browser HTML
<script src="node_modules/penplot-stroke/build.js"></script>

// Set up parameters
const input_path = [ [1, 2], [5, 7], [3, 5] ];
const line_width = 4;    // The thickness you want the line to end up as
const pen_thickness = 1; // The thickness of each individual pen line

// Call the algorithm
const output_paths = createStroke(path, line_width, pen_thickness);
// outputs 4 paths because you need 4 pen strokes to fill the line width of 4
```

## Output
You can view a demo by downloading the source and opening [example.html](./example.html). In the mean time this is an example of what the output is with a input pen thickness larger than the actual drawing thickness of the strokes.
![Example Output Image](./stroke.png)