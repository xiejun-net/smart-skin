import typescript from 'rollup-plugin-typescript';

export default {
  input: 'index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm'
  },
  plugins: [
    typescript({lib: ["es5", "es6"], target: "es5"})
  ]
};
