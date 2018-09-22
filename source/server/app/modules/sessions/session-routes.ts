import { IDatabase } from '../../db';
import SessionController from './session-controller';
import * as SessionValidator from './session-validator';
import { IRouter, IRoutesConfig } from '../../router';

export default (prefix: string, router: IRouter, db: IDatabase): void => {
    const controller = new SessionController(db);
    router.addRoutes(<IRoutesConfig>{
        controller: controller,
        options: [{
            method: 'POST',
            path: `${prefix}/sessions`,
            handler: controller.create,
            config: {
                auth: false,
                validate: {
                    payload: SessionValidator.createSessionModel
                }
            }
        },
        {
            method: 'DELETE',
            path: `${prefix}/sessions`,
            handler: controller.delete
        }]
    });
};
