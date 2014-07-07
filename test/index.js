var Lab = require('lab')
var Hapi = require('hapi')

Lab.experiment('plugin', function () {
    var server = null;

    Lab.beforeEach(function (done) {
        server = new Hapi.Server('localhost', 8080);
        done();
    });

    Lab.afterEach(function (done) {
        var stopServer = function(){
             server.stop(function(){
                 server = null;
                 done();
             });
        }

        if(server.plugins['hapi-level']){
            server.plugins['hapi-level'].db.close(stopServer)
        } else {
            stopServer
        }
    });

    Lab.test('Plugin can register with default settings', function (done) {
        server.pack.register({
            plugin: require('../index')
        }, function(err) {
            Lab.expect(err).to.equal(undefined);
            done();
        })
    });

    Lab.test('Plugin can register with data directory set', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data'
            }
        }, function(err) {
            Lab.expect(err).to.equal(undefined);
            done();
        })
    });

    Lab.test('Testing Level operations', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data_test2'
            }
        }, function(err) {
            Lab.expect(err).to.equal(undefined);

            server.start(function(){
                var db = server.plugins['hapi-level'].db

                db.put('name', 'Level', function (err) {
                    db.get('name', function (err, value) {
                        Lab.expect(value).to.equal('Level');
                        done();
                    })
                })
            })
        })
    });

    Lab.test('Testing initialisaation with extra config', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data_test2',
                config: {
                    valueEncoding: 'json'
                }
            }
        }, function(err) {
            Lab.expect(err).to.equal(undefined);

            server.start(function(){
                var db = server.plugins['hapi-level'].db

                db.put('name', 'Level', function (err) {
                    db.get('name', function (err, value) {
                        Lab.expect(value).to.equal('Level');
                        done();
                    })
                })
            })
        })
    });
});
