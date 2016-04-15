'use strict';

const Level = require('level');
const Sublevel = require('level-sublevel');

exports.register = function (plugin, options, done) {

    const path = options.path || './data';
    const config = options.config || {};

    let db;

    plugin.ext({
        type: 'onPreStart',
        method: function (server, next) {

            db = Sublevel(Level(path, config));
            server.expose('db', db);
            return next();
        }
    });

    plugin.ext({
        type: 'onPreStop',
        method: function (server, next) {

            if (!db) {
                return next();
            }

            db.close((err) => {

                return next(err);
            });
        }
    });

    return done();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
