module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],

  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@modules': ['./src/modules'],
          '@configs': ['./src/configs'],
          '@shared': ['./src/shared'],
          '@errors': ['./src/errors'],
          '@utils': ['./src/utils'],
          '@swagger': ['./src/swagger'],
          '@middlewares': ['./src/middlewares'],
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false,
      },
    ],
  ],
};
