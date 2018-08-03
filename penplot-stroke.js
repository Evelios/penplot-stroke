import array from 'new-array';
import Vector from 'vector';

export default function stroke(path, line_width, pen_thickness) {
  "use strict";

  const num_strokes = Math.ceil(line_width / pen_thickness);
  const stroke_offset = line_width / num_strokes;

  return array(num_strokes).map((_, stroke_index) => {
    return path.map((vertex, vertex_index, verticies) => {
      let angle_offset;

      // Save the edge cases
      // if ((vertex_index === 0 || vertex_index === verticies.length - 1) &&
      //     !Vector.equals(verticies[0], verticies[verticies.length - 1])) {
      if (vertex_index === 0 || vertex_index === verticies.length - 1) {
        // Use the perpendicular to the current segment as the reference line
        const other_vertex = vertex_index === 0 ? verticies[1] : verticies[verticies.length - 2];
        angle_offset = Math.PI/2 + Vector.angle(Vector.subtract(vertex, other_vertex));

      } else {
        // Use the angle bisector of the vertex and it's neighbors as the reference line
        const left_vertex = verticies[Math.abs((vertex_index - 1) % verticies.length)];
        const right_vertex = verticies[(vertex_index + 1) % verticies.length];

        const left_angle = Vector.angle(Vector.subtract(vertex, left_vertex));
        const right_angle = Vector.angle(Vector.subtract(vertex, right_vertex));

        angle_offset = left_angle - right_angle;
      }
      
      // Calculate the offset vector based on the angle of the reference line
      const vertex_offset = Vector.Polar(stroke_index * stroke_offset, angle_offset);
      return Vector.add(vertex, vertex_offset);

    });
  });
}