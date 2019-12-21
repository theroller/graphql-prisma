'use strict';

require('./env');

const server = require('./server');
const serverConfig = {
    port: process.env.PORT || 4000,
};
server.start(serverConfig, () => {
    console.log(`server is up on port ${serverConfig.port}`);
});
