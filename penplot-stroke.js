import array from 'new-array';
import Vector from 'vector';

export function stroke(path, line_width, pen_thickness) {
  "use strict";

  const num_strokes = math.ceil(line_width / pen_thickness);
  const stroke_offset = line_width / num_strokes;

  return path.map((vertex, vertex_index, verticies) => {
    return array(num_strokes).map((_, stroke_index) => {
      let angle_offset;

      // Save the edge cases
      if ((index === 0 || index === verticies.length-1) &&
          !Vector.equals(verticies[0] !== verticies[verticies.length - 1])) {
          // Use the perpendicular to the current segment as the reference line
          const other_vertex = index === 0 ? vertecies[1] : verticies[verticies.length - 1];
          angle_offset = Math.PI/2 + Vector.angle(Vector.subtract(vertex, other_vertex));

      } else {
        // Use the angle bisector of the vertex and it's neighbors as the reference line
        const left_vertex = verticies[(vertex_index - 1) % verticies.length];
        const right_vertex = verticies[(vertex_index + 1) % verticies.length];

        const left_angle = Vector.angle(Vector.subtract(vertex, left_vertex));
        const right_angle = Vector.angle(Vector.subtract(vertex, right_vertex));

        angle_offset = Math.abs(left_angle, right_angle);
      }
      
      // Calculate the offset vector based on the angle of the reference line
      const vertex_offset = Vector.Polar(stroke_index * stroke_offset, angle_offset);
      return Vector.add(vertex, vertex_offset);

    });
  });
}