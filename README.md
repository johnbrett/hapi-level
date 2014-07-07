hapi-level
==========

A simple LevelDB plugin for Hapi.

[![Build Status](https://travis-ci.org/johnbrett/hapi-level.svg?branch=master)](https://travis-ci.org/johnbrett/hapi-level) [![Dependency Status](https://david-dm.org/johnbrett/hapi-level.svg)](https://david-dm.org/johnbrett/hapi-level)

[![NPM](https://nodei.co/npm/hapi-level.png?stars&downloads)](https://nodei.co/npm/hapi-level/)

Register plugin as follows, an optional options object can be passed in to specify data storage location 'path', and the config object supports all [LevelUp](https://github.com/rvagg/node-levelup) options:

```javascript
var server = Hapi.createServer('0.0.0.0', 8000);
server.pack.register([
    { 
        plugin: require('hapi-level'),
        options: {
            path: './data', // ./data by default
            config: {
                valueEncoding: 'json' // utf8 by default as with LevelUP
            }
        } 
    }
  ], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    })
}
```

To use plugin:

```javascript

// Accessing level object
var db = request.server.plugins['hapi-level'] // access from a request object

// or

var db = plugin.plugins['hapi-level'].db // access in a hapi plugin

// Usage works just like LevelDB would
db.put('name', 'Level', function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error

      db.get('name', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found

        console.log('name=' + value)
      })
    })
})

// Sublevel is also available to use for sectioning of data, similar to SQL tables
var users = db.sublevel('users') 

users.put('name', 'Level', function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error

      users.get('name', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found

        console.log('name=' + value)
      })
    })
})
```
