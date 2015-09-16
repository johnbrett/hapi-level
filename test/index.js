var Lab = require('lab');
var Hapi = require('hapi');
var Code = require('code');
var HapiLevel = require('..');
var RimRaf = require('rimraf');
var Fs = require('fs');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var expect = Code.expect;

describe('hapi-level', function () {

    var server = null;
    var path = './data';

    before(function (done) {

        RimRaf.sync(path);
        Fs.mkdirSync(path);
        done();
    });

    beforeEach(function (done) {

        server = new Hapi.Server();
        server.connection();
        done();
    });

    afterEach(function (done) {

        server = null;
        done();
    });

    after(function (done) {

        RimRaf.sync(path);
        done();
    });

    it('can register with default settings', { parallel: false }, function (done) {

        server.register( HapiLevel, function (err) {

            expect(err).to.equal(undefined);
            done();
        });
    });

    it('can register with data directory set', { parallel: false }, function (done) {

        server.register({
            register: HapiLevel,
            options: {
                path: path + '/db1'
            }
        }, function (err) {

            expect(err).to.equal(undefined);
            done();
        });
    });

    it('can use regular level operations', { parallel: false }, function (done) {

        server.register({
            register: HapiLevel,
            options: {
                path: path + '/db2'
            }
        }, function (err) {

            expect(err).to.equal(undefined);

            var db = server.plugins['hapi-level'].db;

            db.put('name', 'Level', function (err) {

                db.get('name', function (err, value) {

                    expect(value).to.equal('Level');
                    done();
                });
            });
        });
    });

    it('can specify extra level config such as valueEncoding', { parallel: false }, function (done) {

        server.register({
            register: HapiLevel,
            options: {
                path: path + '/db3',
                config: {
                    valueEncoding: 'json'
                }
            }
        }, function (err) {

            expect(err).to.equal(undefined);

            var db = server.plugins['hapi-level'].db;

            db.put('name', 'Level', function (err) {

                db.get('name', function (err, value) {

                    expect(value).to.equal('Level');
                    done();
                });
            });
        });
    });

    it('can use sublevel functions as expected', { parallel: false }, function (done) {

        server.register({
            register: HapiLevel,
            options: {
                path: path + '/db4',
                config: {
                    valueEncoding: 'json'
                }
            }
        }, function (err) {

            expect(err).to.equal(undefined);

            var db = server.plugins['hapi-level'].db;

            var users = db.sublevel('users');

            users.put('name', { username:'User1', id: 1 }, function (err) {

                users.get('name', function (err, value) {

                    expect(err).to.equal(null);
                    expect(JSON.stringify(value)).to.equal(JSON.stringify({ username:'User1', id: 1 }));
                    done();
                });
            });
        });
    });
});
