System.config({
  transpiler: 'babel',
  map: {
    'react': '//unpkg.com/react@15.5.0/dist/react.js',
    'react-dom': '//unpkg.com/react-dom@15.5.0/dist/react-dom.js',
    'redux': '//unpkg.com/redux@3.6.0/dist/redux.js',
    'react-redux': '//wzrd.in/standalone/',
    'lodash.debounce': '//wzrd.in/standalone/lodash.debounce@latest',
    'permissive-fov': '//wzrd.in/standalone/permissive-fov',
    'pathfinding': '//wzrd.in/standalone/pathfinding',
//    'chai': '//unpkg.com/chai@3.5.0',
//    'mocha': '//unpkg.com/mocha@3.3.0'

    'app': './app'
  },
  meta: {
    'app': { 
      deps: [ 'react-redux', 'react-dom', 'permissive-fov', 'pathfinding' ] 
    },
    'react-redux': { deps: [ 'react', 'redux' ] },
    'react-dom': { deps: [ 'react' ] }
  },
  packages: {
    app: {
      main: './components/Game.jsx',
      defaultExtension: false,
    },
    'react-redux': {
      main: 'react-redux@latest',
      defaultExtension: false,
    }
  }
});