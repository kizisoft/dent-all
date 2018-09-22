import * as path from 'path';

const appDir = path.dirname(require.main.filename);
const secrets = require(path.join(__dirname, './secrets.dev.json'));

export = {
    ENV: 'Dev',
    PORT: process.env.PORT || 4200,
    HOST: 'localhost',
    PUBLIC_ROUTE: path.join(appDir, '../client'),
    CONNECTION_STRING: process.env.MONGO_URL || 'mongodb://localhost:27017/dent-all',
    PLUGINS: ['inert', 'auth-jwt'],
    ROUTE_PREFIX: '/api',
    ADMIN_USER_SEED_PASSWORD: process.env.ADMIN_USER_SEED_PASSWORD || secrets.adminUserSeedPassword,
    JWT_KAY: process.env.JWT_KAY || secrets.jwtKey
};
