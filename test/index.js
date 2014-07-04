var Lab = require('lab')
var Hapi = require('hapi')

Lab.experiment('plugin', function () {
    var server = null;

    Lab.beforeEach(function (done) {
        server = new Hapi.Server();
        done();
    });

    Lab.afterEach(function (done) {
        server = null;
        done();
    });

    Lab.test('Plugin can register with default settings', function (done) {
        server.pack.register({
            plugin: require('../index')
        }, function(err) {
            Lab.expect(err).to.equal(undefined);
            done();
        })
    });
});
