'use strict';

module.exports = teardown;

async function teardown() {
    await global.httpServer.close();
    process.exit();
}
