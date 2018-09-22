import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import config from '../../config';
import { IDatabase } from '../../db';
import { IUser } from '../users/user-model';
import { BaseController } from '../base-controller';

export default class SessionController extends BaseController {
    constructor(db: IDatabase) {
        super(db);
    }

    async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const credentials = request.payload;
        let user: IUser;
        let isEqual: boolean;

        try {
            user = await this.db.users.findOne({ email: credentials.email });
        } catch (error) {
            return reply(Boom.badRequest('Invalid email or password'));
        }

        if (!user) {
            return reply(Boom.badRequest('Invalid email or password'));
        }

        try {
            isEqual = await bcrypt.compare(credentials.password, user.hashPassword);
        } catch (error) {
            return reply(Boom.badImplementation('Impossible to decript password', error));
        }

        if (!isEqual) {
            return reply(Boom.badRequest('Invalid email or password'));
        }

        // Delete the expired tokens
        const sessions = user.sessions.filter(token => {
            const decoded: any = jwt.decode(token);
            const now = Math.floor(Date.now() / 1000);
            const isValid = decoded.exp > now;
            return isValid;
        });

        const session = jwt.sign({ id: user.id, email: credentials.email, scope: user.scope }, config.JWT_KAY, { expiresIn: '8h' });
        sessions.push(session);
        user.sessions = sessions;
        await user.save();
        return reply({ session }).code(201);
    }

    async delete(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const session = request.params.session || request.headers.authorization;
        const user: IUser = (<any>request.auth).user;
        user.sessions = user.sessions.filter(token => session !== token);
        await user.save();
        return reply();
    }
}
