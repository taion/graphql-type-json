module.exports = (api) => ({
  presets: [
    [
      '@babel/env',
      {
        bugfixes: true,
        loose: true,
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
  ],
});
