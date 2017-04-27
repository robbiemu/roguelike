System.config({
  transpiler: 'babel',
  map: {
    'react': '//unpkg.com/react@15.5.0/dist/react.js',
    'react-dom': '//unpkg.com/react-dom@15.5.0/dist/react-dom.js',
    'react-redux': '//wzrd.in/standalone/react-redux@latest',
    'redux': '//unpkg.com/redux@3.6.0/dist/redux.js',
//    'chai': '//unpkg.com/chai@3.5.0',
//    'mocha': '//unpkg.com/mocha@3.3.0'

    'app': './app'
  },
  depCache: {
    'react-redux': ['react', 'redux'],
    'react-dom': ['react'] 
  },
  meta: {
    'react-redux': {
      deps: [ 'react', 'redux']
    },
    'react-dom': {
      deps: ['react']
    }
  },
  packages: {
    app: {
      main: './components/Game.jsx',
      defaultExtension: false,
    }
  }
});