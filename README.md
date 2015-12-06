hapi-level
==========

A simple LevelDB plugin for Hapi.

[![Build Status](https://travis-ci.org/johnbrett/hapi-level.svg?branch=master)](https://travis-ci.org/johnbrett/hapi-level) [![Dependency Status](https://david-dm.org/johnbrett/hapi-level.svg)](https://david-dm.org/johnbrett/hapi-level)

**Note:** Sublevel has been updated to v6 in version `3.0.0` which has breaking changes which will corrupt a pre version 6 database, read about the [sublevel breaking changes](https://www.npmjs.com/package/level-sublevel) before updating, there is a [migration tool](https://github.com/calvinmetcalf/sublevel-migrate) to help with the upgrade.

[![NPM](https://nodei.co/npm/hapi-level.png?stars&downloads)](https://nodei.co/npm/hapi-level/)

Register plugin as follows, an optional options object can be passed in to specify data storage location 'path', and the config object supports all [LevelUp](https://github.com/rvagg/node-levelup) options:

```javascript
const Hapi = require('hapi');

var server = Hapi.createServer();
server.connection();

server.register([
    { 
        register: require('hapi-level'),
        options: {
            path: './data', // ./data by default
            config: {
                valueEncoding: 'json' // utf8 by default as with LevelUP
            }
        } 
    }
], (err) => {
    
    if (err) {
        throw err;
    }
    
    server.start((err) => {
    
        if (err) {
            throw err;
        }
        console.log('Server started at: ' + server.info.uri);
    })
};
```

To use plugin:

```javascript

// New in 5.0: Make sure either `server.initialize()` or `server.start()` has been called 
// to have access to the db reference

// Accessing level object
const db = request.server.plugins['hapi-level'].db; // access from a request object

// or

const db = plugin.plugins['hapi-level'].db; // access in a hapi plugin

// Usage works just like LevelDB would
db.put('name', 'Level', (err) => {
    
        if (err) {
            return console.log('Ooops!', err); // some kind of I/O error
        }
    
        db.get('two', (err, value) => {
            
            if (err) {
                return console.log('Ooops!', err); // likely the key was not found
            }
    
            console.log('name=' + value);
        });
    });
});

// Sublevel is also available to use for sectioning of data, similar to SQL tables
users.put('two', {id: 2, name: 'Level'}, (err) => {
      
        if (err) {
            return console.log('Ooops!', err); // some kind of I/O error
        }
    
        users.get('two', (err, value) => {
            
            if (err) {
                return console.log('Ooops!', err); // likely the key was not found
            }
    
            console.log(value); // would output {id: 2, name: 'Level'}
        });
    });
});
```
