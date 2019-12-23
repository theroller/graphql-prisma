'use strict';

require('./env');

const server = require('./server');
const serverConfig = {
    port: process.env.PORT,
};
server.start(serverConfig, () => {
    console.log(`server is up on port ${serverConfig.port}`);
});
