import array from 'new-array';
import Vector from 'vector';
import lineIntersection from 'line-intersection';

export default function stroke(path, line_width, pen_thickness) {
  "use strict";

  const num_strokes = Math.ceil(line_width / pen_thickness);
  const stroke_offset = line_width / num_strokes;

  console.log("Num Strokes   : ", num_strokes);
  console.log("Stroke offset : ", stroke_offset);

  return array(num_strokes).map((_, stroke_index) => {
    return path.map((vertex, vertex_index, verticies) => {
      const previous_index = (vertex_index - 1 + verticies.length) % verticies.length;
      const next_index = (vertex_index + 1) % verticies.length;
      const current_offset = stroke_offset + stroke_offset * stroke_index;
      //console.log("Prev : ", previous_index);
      //console.log("Curr : ", vertex_index);
      //console.log("Next : ", next_index);

      const previous_vertex = verticies[previous_index];
      const next_vertex = verticies[next_index];

      const previous_segment = offsetLineSegment([previous_vertex, vertex], current_offset);
      const next_segment = offsetLineSegment([next_vertex, vertex], current_offset);

      return lineIntersection(previous_segment, next_segment);

    });

    // Helper Function

    function offsetLineSegment(line, dist) {
      const angle = Vector.angle(Vector.subtract(line[0], line[1]));

      return [
        Vector.add(line[0], Vector.Polar(dist, angle + Math.PI/2)),
        Vector.add(line[1], Vector.Polar(dist, angle + Math.PI/2))
      ];
    }
  });
}