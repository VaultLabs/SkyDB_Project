// eslint-disable-next-line
const {
  override,
  addBabelPlugin,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader,
  useEslintRc,
} = require('customize-cra');
const path = require('path');
const { getThemeVariables } = require('antd/dist/theme');

const theme = getThemeVariables({dark: true})
module.exports = override(
  addBabelPlugin('react-hot-loader/babel'),
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addWebpackAlias({
    'react-dom': '@hot-loader/react-dom',
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        ...theme,
        'primary-color': '#4ed18f',
        'link-color': '#4ed18f',

      }

    }
  }),
);
