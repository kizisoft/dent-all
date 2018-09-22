import { IDatabase } from '../../../db';
import UserController from './admin-user-controller';
import * as UserValidator from './admin-user-validator';
import { IRouter, IRoutesConfig } from '../../../router';

export default (prefix: string, router: IRouter, db: IDatabase): void => {
    const controller = new UserController(db);
    router.addRoutes(<IRoutesConfig>{
        controller: controller,
        options: [{
            method: 'POST',
            path: `${prefix}/admin/users`,
            handler: controller.create,
            config: {
                validate: {
                    payload: UserValidator.createAdminUserModel
                },
                auth: { scope: ['admin'] }
            }
        },
        {
            method: 'GET',
            path: `${prefix}/admin/users`,
            handler: controller.getAll,
            config: { auth: { scope: ['admin'] } }
        },
        {
            method: 'GET',
            path: `${prefix}/admin/users/{id}`,
            handler: controller.getById,
            config: { auth: { scope: ['admin'] } }
        },
        {
            method: 'PUT',
            path: `${prefix}/admin/users/{id}`,
            handler: controller.update,
            config: {
                validate: {
                    payload: UserValidator.updateAdminUserModel
                },
                auth: { scope: ['admin'] }
            }
        }]
    });
};
