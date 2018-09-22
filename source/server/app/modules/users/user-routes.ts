import { IDatabase } from '../../db';
import UserController from './user-controller';
import * as UserValidator from './user-validator';
import { IRouter, IRoutesConfig } from '../../router';

export default (prefix: string, router: IRouter, db: IDatabase): void => {
    const controller = new UserController(db);
    router.addRoutes(<IRoutesConfig>{
        controller: controller,
        options: [{
            method: 'GET',
            path: `${prefix}/users`,
            handler: controller.getAll
        },
        {
            method: 'GET',
            path: `${prefix}/users/{id}`,
            handler: controller.getById
        },
        {
            method: 'PUT',
            path: `${prefix}/users`,
            handler: controller.update,
            config: {
                validate: {
                    payload: UserValidator.updateUserModel
                }
            }
        }]
    });
};
