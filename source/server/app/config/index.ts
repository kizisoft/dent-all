const env = process.env.NODE_ENV || 'dev';
const config: IConfig = require(`./server.${env}.config`);

export interface IConfig {
    ENV: string;
    PORT: string;
    HOST: string;
    PUBLIC_ROUTE: string;
    CONNECTION_STRING: string;
    PLUGINS: Array<string>;
    ROUTE_PREFIX: string;
    ADMIN_USER_SEED_PASSWORD: string;
    JWT_KAY: string;
}

export default config;
