const fs = require('fs');

if (fs.existsSync(process.env.DOTENV_CONFIG_PATH)) {
    require('dotenv/config');
}
