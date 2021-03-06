import array from 'new-array';
import Vector from 'vector';
import lineIntersection from 'line-intersection';

export default function stroke(path, line_width, pen_thickness, options) {
  "use strict";

  if (path.length == 1) {
    return path;
  }

  // ---- Options -----
  const defaults = {
    polygon          : false,     // Should the input path be a closed polygon
    endcap           : 'none',    // none, square, circle, triangle, indent
    corner           : 'square',  // square, #-not supported--> round, bevel
    line_style       : [],        // Used for creating dashed lines, must be even length
    align_stroke     : 'center',  // center, #-not supported--> inset, outset
    line_width_style : [1]        // Used for varying the line width
  };
  const params = Object.assign({}, defaults, options);

  // console.log('Polygon          : ', params.polygon);
  // console.log('Endcap           : ', params.endcap);
  // console.log('Corner           : ', params.corner);
  // console.log('Line Style       : ', params.line_style);
  // console.log('Align Stroke     : ', params.align_stroke);
  // console.log('Line Width Style : ', params.line_width_style);

  const input_endpoints_equal = Vector.equals(path[0],path[path.length - 1]);
  const is_polygon = params.polygon || input_endpoints_equal;
  const working_path = params.polygon && !input_endpoints_equal ?
    path.concat([path[0]]) :
    path;

  // Calculate the number of strokes to draw and the proper spacing between them
  const num_strokes = Math.max(Math.ceil(line_width / pen_thickness), 1);
  const stroke_offset = line_width / num_strokes;
  
  return array(num_strokes).map((_, stroke_index) => {
    return working_path.map((vertex, vertex_index, verticies) => {

      // Calculate the indecies of the next verticies
      const max_index = is_polygon ? verticies.length - 1 : verticies.length;
      const previous_index = (vertex_index - 1 + max_index) % max_index;
      const next_index = (vertex_index + 1) % max_index;

      // Calculate the current stroke offset from the input line
      const line_width_modifier = params.line_width_style[
        vertex_index % params.line_width_style.length
      ];

      const current_offset = line_width_modifier * stroke_offset * Math.floor(stroke_index / 2);

      // Get the previous and next verticies
      const previous_vertex = verticies[previous_index];
      const next_vertex = verticies[next_index];

      // The the two offset lines from the corner vertex
      const segment_rotation = (stroke_index % 2) === 0;
      const previous_segment = offsetLineSegment([previous_vertex, vertex], current_offset, segment_rotation);
      const next_segment = offsetLineSegment([next_vertex, vertex], current_offset, !segment_rotation);

      // Account for edge cases of endpoints when the path isn't a polygon
      if (vertex_index === 0 && !is_polygon) {
        const line_angle = Vector.angle(Vector.subtract(next_segment[1], next_segment[0]));
        return addEndcap(next_segment[1], current_offset, line_width_modifier, line_angle);
      }
      else if (vertex_index === verticies.length - 1 && !is_polygon) {
        const line_angle = Vector.angle(Vector.subtract(previous_segment[1], previous_segment[0]));
        return addEndcap(previous_segment[1], current_offset, line_width_modifier, line_angle);
      }

      // Add the intersection of the two offset lines
      return lineIntersection(previous_segment, next_segment);

    });

  });

  /**
   * Get the line that is shifted perpendicular to the input line
   * 
   * @param line The line to be offset from
   * @param dist The distane the offset the line
   * @param left_endpoint
   * 
   * @returns {Line} The line offset by a particular distance
   */
  function offsetLineSegment(line, dist, left_endpoint) {
    const angle = Vector.angle(Vector.subtract(line[0], line[1]));
    const rotation = left_endpoint ? -Math.PI/2 : Math.PI/2;
    const offset = Vector.Polar(dist, angle + rotation);

    return [
      Vector.add(line[0], offset),
      Vector.add(line[1], offset)
    ];
  }

  /**
   * Add the endcap style to the end point of the path
   * 
   * @param {any} point The endpoint
   * @param {any} offset The current offset of the line from the input line
   * @param {any} stroke_width The total stroke width
   * @param {any} angle The angle of the current segment that is being worked on
   */
  function addEndcap(point, line_offset, width_modifier, angle) {
    const endcap_extension = {
      none     : ((dx, w) => 0),
      square   : ((dx, w) => w),
      round    : ((dx, w) => Math.sqrt(w*w - dx*dx)),
      triangle : ((dx, w) => w - dx),
      indent   : ((dx, w) => dx),
    };

    const extension_fn = endcap_extension[params.endcap] || endcap_extension.none;
    console.assert(endcap_extension[params.endcap] !== undefined, 'Invalid End Cap Assignment :', params.endcap);

    const current_line_width = width_modifier * line_width;
    const point_offset = extension_fn(line_offset, current_line_width / 2);
    return Vector.offset(point, point_offset, angle);
  }
}