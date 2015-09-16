var Level = require('level');
var Sublevel = require('level-sublevel');

exports.register = function (plugin, options, next) {

    var path = options.path || './data';
    var config = options.config || {};

    var db = Sublevel(Level(path, config));

    plugin.expose('db', db);
    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
