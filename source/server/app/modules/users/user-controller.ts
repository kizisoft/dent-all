import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { BaseController } from '../base-controller';
import { IDatabase } from '../../db';
import { IUser } from './user-model';
import * as Mapper from './user-mapper';
import { hashPassword } from '../../utilities/crypt';

export default class UserController extends BaseController {
    constructor(db: IDatabase) {
        super(db);
    }

    async getAll(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let users: Array<IUser>;

        try {
            users = await this.db.users.find().exec();
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to find users', error));
        }

        return reply(Mapper.toUserOutputModels(users));
    }

    async getById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let user: IUser;

        try {
            user = await this.db.users.findById(request.params.id).exec();
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to find user', error));
        }

        if (!user) {
            return reply(Boom.notFound('User does not existe'));
        }

        return reply(Mapper.toUserOutputModel(user));
    }

    // User could update only himself
    async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const user: IUser = (<any>request.auth).user;
        let userDb: IUser;

        if (request.payload.password) {
            try {
                request.payload.hashPassword = await hashPassword(request.payload.password);
            } catch (error) {
                return reply(Boom.badImplementation('Encryption failed', error));
            }
        }

        try {
            userDb = await user.update(request.payload).exec();
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to update user', error));
        }

        if (!userDb) {
            return reply(Boom.notFound('User does not existe'));
        }

        return reply(Mapper.toUserOutputModel(userDb));
    }
}
