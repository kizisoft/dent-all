import * as Hapi from 'hapi';

import config from './app/config';
import { Database } from './app/db';
import { Plugins } from './app/plugins';
import { Router } from './app/router';

export default class Server {
    static async init(): Promise<Hapi.Server> {
        const server = new Hapi.Server();
        server.connection({ port: config.PORT, host: config.HOST });

        try {
            // Connect to the database
            const db = await Database.init();

            // Setup Hapi plugins 
            await Plugins.init(server, db);

            // Setup server routes
            await Router.init(config.ROUTE_PREFIX, server, db);
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(server);
    }
}
