import typescript from 'rollup-plugin-typescript';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm'
    },
    {
      file: 'docs/index.common.js',
      format: 'umd',
      name: 'SmartSkin'
    }
  ],
  plugins: [
    typescript({lib: ["es5", "es6"], target: "es5"})
  ]
};
