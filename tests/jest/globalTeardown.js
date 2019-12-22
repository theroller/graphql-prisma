'use strict';

module.exports = globalTeardown;

async function globalTeardown() {
    await global.httpServer.close();
    process.exit();
}
