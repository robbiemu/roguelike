System.config({
  transpiler: 'babel',
  map: {
    'react': 'https://unpkg.com/react@15.5.0/dist/react.js',
    'react-dom': 'https://unpkg.com/react-dom@15.5.0/dist/react-dom.js',

    'app': './app'
  },
  packages: {
    app: {
      main: './components/Game.jsx',
      defaultExtension: false,
    },
  }
});