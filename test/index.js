var Lab = require('lab')
var Hapi = require('hapi')
var Code = require('code')
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

describe('hapi-level', function () {
    var server = null

    beforeEach(function (done) {
        server = new Hapi.Server('localhost', 8080)
        done()
    });

    afterEach(function (done) {

        var stopServer = function(){
             server.stop(function(){
                 server = null
                 done()
             });
        };

        if(server.plugins['hapi-level']){
            server.plugins['hapi-level'].db.close(stopServer)
        } else {
            stopServer()
        }
    });

    it('can register with default settings', function (done) {
        server.pack.register({
            plugin: require('../index')
        }, function(err) {
            expect(err).to.equal(undefined)
            done()
        })
    });

    it('can register with data directory set', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data'
            }
        }, function(err) {
            expect(err).to.equal(undefined)
            done()
        })
    });

    it('can use regular level operations', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data'
            }
        }, function(err) {
            expect(err).to.equal(undefined);

            server.start(function(){
                var db = server.plugins['hapi-level'].db

                db.put('name', 'Level', function (err) {
                    db.get('name', function (err, value) {
                        expect(value).to.equal('Level')
                        done()
                    })
                })
            })
        })
    });

    it('can specify extra level config such as valueEncoding', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data/test2',
                config: {
                    valueEncoding: 'json'
                }
            }
        }, function(err) {
            expect(err).to.equal(undefined);

            server.start(function(){
                var db = server.plugins['hapi-level'].db

                db.put('name', 'Level', function (err) {
                    db.get('name', function (err, value) {
                        expect(value).to.equal('Level')
                        done()
                    })
                })
            })
        })
    });

    it('can use sublevel functions as expected', function (done) {
        server.pack.register({
            plugin: require('../index'),
            options: {
                path: './data/test2',
                config: {
                    valueEncoding: 'json'
                }
            }
        }, function(err) {
            expect(err).to.equal(undefined);

            server.start(function(){
                var db = server.plugins['hapi-level'].db

                var users = db.sublevel('users')

                users.put('name', {'username':'User1', 'id': 1}, function (err) {
                    users.get('name', function (err, value) {
                        expect(err).to.equal(null);
                        expect(JSON.stringify(value)).to.equal(JSON.stringify({'username':'User1', "id": 1}))
                        done()
                    });
                })
            })
        })
    });
});
