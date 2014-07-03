hapi-level
==========

A simple LevelBD plugin for Hapi.

Register plugin:

```javascript
var server = Hapi.createServer('0.0.0.0', 8000);
server.pack.register([
    { plugin: require('hapi-level') }
  ], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    })
}
```

To use plugin:

```javascript
var db = request.server.plugins['hapi-level']

db.put('name2', 'Level', function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error

      // 3) fetch by key
      db.get('name2', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found

        // ta da!
        console.log('name=' + value)
      })
    })
})
```

OR

```javascript
var db = plugin.plugins['hapi-level'].db

db.put('name2', 'Level', function (err) {
      if (err) return console.log('Ooops!', err) // some kind of I/O error

      // 3) fetch by key
      db.get('name2', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found

        // ta da!
        console.log('name=' + value)
      })
    })
})
```