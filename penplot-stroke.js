import array from 'new-array';
import Vector from 'vector';
import lineIntersection from 'line-intersection';

export default function stroke(path, line_width, pen_thickness) {
  "use strict";

  const num_strokes = Math.ceil(line_width / pen_thickness);
  const stroke_offset = line_width / num_strokes;

  return array(num_strokes).map((_, stroke_index) => {
    return path.map((vertex, vertex_index, verticies) => {
      const previous_index = (vertex_index - 1 + verticies.length) % verticies.length;
      const next_index = (vertex_index + 1) % verticies.length;
      const current_offset = stroke_offset + stroke_offset * Math.floor(stroke_index / 2);

      const previous_vertex = verticies[previous_index];
      const next_vertex = verticies[next_index];

      const segment_rotation = (stroke_index % 2) === 0;
      const previous_segment = offsetLineSegment([previous_vertex, vertex], current_offset, segment_rotation);
      const next_segment = offsetLineSegment([next_vertex, vertex], current_offset, !segment_rotation);

      if (vertex_index === 0) {
        return next_segment[1];
      }
      else if (vertex_index === verticies.length - 1) {
        return previous_segment[1];
      }

      return lineIntersection(previous_segment, next_segment);

    });

    function offsetLineSegment(line, dist, left_endpoint) {
      const angle = Vector.angle(Vector.subtract(line[0], line[1]));
      const rotation = left_endpoint ? -Math.PI/2 : Math.PI/2;
      const offset = Vector.Polar(dist, angle + rotation);

      return [
        Vector.add(line[0], offset),
        Vector.add(line[1], offset)
      ];
    }
  });
}