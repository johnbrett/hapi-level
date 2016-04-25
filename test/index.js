'use strict';

const Lab = require('lab');
const Hapi = require('hapi');
const Code = require('code');
const HapiLevel = require('..');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const expect = Code.expect;

describe('hapi-level', () => {

    let server = null;
    const path = './data';

    beforeEach((done) => {

        server = new Hapi.Server();
        server.connection();
        done();
    });

    afterEach((done) => {

        server.stop(() => {

            server = null;
            done();
        });
    });

    it('can register with default settings', { parallel: false }, (done) => {

        server.register(HapiLevel, (err) => {

            expect(err).to.equal(undefined);
            done();
        });
    });

    it('can register with data directory set', { parallel: false }, (done) => {

        server.register({
            register: HapiLevel,
            options: {
                path: path
            }
        }, (err) => {

            expect(err).to.not.exist();
            done();
        });
    });

    it('can use regular level operations', { parallel: false }, (done) => {

        server.register({
            register: HapiLevel,
            options: {
                path: path
            }
        }, (err) => {

            expect(err).to.not.exist();

            server.initialize((err) => {

                expect(err).to.not.exist();

                const db = server.plugins['hapi-level'].db;

                db.put('name', 'Level', (err) => {

                    expect(err).to.not.exist();

                    db.get('name', (err, value) => {

                        expect(err).to.not.exist();
                        expect(value).to.equal('Level');
                        done();
                    });
                });
            });
        });
    });

    it('can specify extra level config such as valueEncoding', { parallel: false }, (done) => {

        server.register({
            register: HapiLevel,
            options: {
                path: path,
                config: {
                    valueEncoding: 'json'
                }
            }
        }, (err) => {

            expect(err).to.not.exist();

            server.initialize((err) => {

                expect(err).to.not.exist();

                const db = server.plugins['hapi-level'].db;

                db.put('name', 'Level', (err) => {

                    expect(err).to.not.exist();

                    db.get('name', (err, value) => {

                        expect(err).to.not.exist();
                        expect(value).to.equal('Level');
                        done();
                    });
                });
            });
        });
    });

    it('can use sublevel functions as expected', { parallel: false }, (done) => {

        server.register({
            register: HapiLevel,
            options: {
                path: path,
                config: {
                    valueEncoding: 'json'
                }
            }
        }, (err) => {

            expect(err).to.not.exist();

            server.initialize((err) => {

                expect(err).to.not.exist();

                const db = server.plugins['hapi-level'].db;
                const users = db.sublevel('users');

                users.put('name', { username:'User1', id: 1 }, (err) => {

                    expect(err).to.not.exist();

                    users.get('name', (err, value) => {

                        expect(err).to.not.exist();
                        expect(JSON.stringify(value)).to.equal(JSON.stringify({ username:'User1', id: 1 }));
                        done();
                    });
                });
            });
        });
    });
});
