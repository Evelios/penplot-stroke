import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins = [
  resolve(),
  commonjs(),
];

export default {
  plugins,
  input: './penplot-stroke.js',
  output: [
    // UMD Build
    {
      name: 'createStroke',
      file: 'build.js',
      format: 'iife',
      interop: false,
    },    
  ],
};