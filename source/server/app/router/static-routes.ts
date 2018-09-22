import config from '../config';
import { IRouter, IRoutesConfig } from './';

export default (router: IRouter): void => {
    router.addRoutes(<IRoutesConfig>{
        controller: null,
        options: [{
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: config.PUBLIC_ROUTE,
                    redirectToSlash: true,
                    index: true,
                }
            },
            config: { auth: false }
        }]
    });
};
