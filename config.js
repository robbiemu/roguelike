System.config({
  transpiler: 'babel',
  map: {
    'react': '//unpkg.com/react@15.5.0/dist/react.js',
    'react-dom': '//unpkg.com/react-dom@15.5.0/dist/react-dom.js',
//    'react-redux': '//wzrd.in/standalone/react-redux@latest',
    'react-redux': '//unpkg.com/react-redux@5.0.4/dist/react-redux.js',
    'redux': '//unpkg.com/redux@3.6.0/dist/redux.js',
//    'chai': '//unpkg.com/chai@3.5.0',
//    'mocha': '//unpkg.com/mocha@3.3.0'

    'app': './app'
  },
  depCache: {
    'react-redux': ['react', 'redux'],
    'react-dom': ['react'] 
  },
  packages: {
    app: {
      main: './components/Game.jsx',
      defaultExtension: false,
    }
  }
});

System.import('react');
System.import('react-dom');
System.import('redux');
System.import('react-redux');