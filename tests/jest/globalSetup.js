'use strict';

require('../../src/env');
const server = require('../../src/server');

module.exports = globalSetup;

async function globalSetup() {
    global.httpServer = await server.start({ port: process.env.PORT });
}
