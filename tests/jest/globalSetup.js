'use strict';

require('../../src/env');
const server = require('../../src/server');

module.exports = setup;

async function setup() {
    global.httpServer = await server.start({ port: process.env.PORT });
}
