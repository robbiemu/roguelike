System.config({
  transpiler: 'babel',
  map: {
    'react': 'https://unpkg.com/react@15.5.0/dist/react.js',
    'react-dom': 'https://unpkg.com/react-dom@15.5.0/dist/react-dom.js',
//    'react-redux': 'https://unpkg.com/react-redux@5.0.4/dist/react-redux.js',
    'redux': 'https://unpkg.com/redux@3.6.0/dist/redux.js',
//    'chai': 'https://unpkg.com/chai@3.5.0',
//    'mocha': 'https://unpkg.com/mocha@3.3.0'

    'app': './app'
  },
  packages: {
    app: {
      main: './components/Game.jsx',
      defaultExtension: false,
    },
  }
});

System.import('react');
System.import('react-dom');
System.import('redux');
System.import('react-redux');