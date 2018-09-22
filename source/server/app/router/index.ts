import * as Hapi from 'hapi';

import { IDatabase } from '../db';
import { IContorller } from '../modules/base-controller';
import staticRoutes from './static-routes';
import userRoutes from '../modules/users/user-routes';
import sessionRoutes from '../modules/sessions/session-routes';
import adminUserRoutes from '../modules/Administration/admin-users/admin-user-routes';

export class Router implements IRouter {
    private static routes = new Array<IRoutesConfig>();

    static async init(prefix: string, server: Hapi.Server, db: IDatabase): Promise<void> {
        const router = new Router();

        // Compose routes
        staticRoutes(router);
        userRoutes(prefix, router, db);
        sessionRoutes(prefix, router, db);

        // Compose administration routes
        adminUserRoutes(prefix, router, db);

        // Register routes
        console.log('Register routes:');
        await Router.routes.forEach(route => {
            server.bind(route.controller);
            server.route(route.options);
            route.options.forEach(option => {
                console.log(`   ${option.method}${option.path}`);
            });
        });
    }

    addRoutes(route: IRoutesConfig) {
        Router.routes.push(route);
    }
}

export interface IRoutesConfig {
    controller: IContorller;
    options: Array<Hapi.RouteConfiguration>;
}

export interface IRouter {
    addRoutes(route: IRoutesConfig);
}
