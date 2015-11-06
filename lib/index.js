'use strict';

const Level = require('level');
const Sublevel = require('level-sublevel');

exports.register = function (server, options, next) {

    const path = options.path || './data';
    const config = options.config || {};

    const db = Sublevel(Level(path, config));

    server.expose('db', db);

    server.ext({
        type: 'onPreStop',
        method: function (request, reply) {

            db.close((err) => {

                return reply();
            });
        }
    });

    return next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
