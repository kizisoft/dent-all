import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { BaseController } from '../../base-controller';
import { IDatabase } from '../../../db';
import { IUser } from '../../users/user-model';
import * as Mapper from './admin-user-mapper';
import { hashPassword } from '../../../utilities/crypt';

export default class AdminUserController extends BaseController {
    constructor(db: IDatabase) {
        super(db);
    }

    async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            request.payload.hashPassword = await hashPassword(request.payload.password);
        } catch (error) {
            return reply(Boom.badImplementation('Encryption failed', error));
        }

        try {
            const isUserExist = await this.db.users.findOne({ email: request.payload.email }).exec();
            if (isUserExist) {
                return reply(Boom.badRequest('The username is already taken'));
            }

            const userDb = await this.db.users.create(<IUser>request.payload);
            return reply(Mapper.toUserOutputModel(userDb)).code(201);
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to create user', error));
        }
    }

    async getAll(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let users: Array<IUser>;

        try {
            users = await this.db.users.find().exec();
            return reply(Mapper.toUserOutputModels(users));
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to find users', error));
        }
    }

    async getById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let user: IUser;

        try {
            user = await this.db.users.findById(request.params.id).exec();
            if (!user) {
                return reply(Boom.notFound('User does not existe'));
            }

            return reply(Mapper.toUserOutputModel(user));
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to find user', error));
        }
    }

    async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        if (request.payload.password) {
            try {
                request.payload.hashPassword = await hashPassword(request.payload.password);
            } catch (error) {
                return reply(Boom.badImplementation('Encryption failed', error));
            }
        }

        try {
            const user = await this.db.users.findByIdAndUpdate(request.params.id, request.payload, { new: true }).exec();
            if (!user) {
                return reply(Boom.notFound('User does not existe'));
            }

            return reply(Mapper.toUserOutputModel(user));
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to update user', error));
        }
    }
}
