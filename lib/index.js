'use strict';

const Level = require('level');
const Sublevel = require('level-sublevel');

exports.register = function (server, options, next) {

    const path = options.path || './data';
    const config = options.config || {};

    let db;

    server.ext({
        type: 'onPreStart',
        method: function (request, reply) {

            db = Sublevel(Level(path, config));
            server.expose('db', db);
            return reply();
        }
    });

    server.ext({
        type: 'onPreStop',
        method: function (request, reply) {

            if (!db) {
                return reply();
            }

            db.close((err) => {

                return reply(err);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
