import * as Hapi from 'hapi';
import * as AuthJwt from 'hapi-auth-jwt2';

import config from '../../config';
import { IPlugin } from '../';
import { IDatabase } from '../../db';

class AuthJwtPlugin implements IPlugin {
    private static db: IDatabase;

    name = 'auth-jwt';
    description = 'User authentication using JWT';

    private static validate(decoded, request, callback) {
        AuthJwtPlugin.db.users.findById(decoded.id)     // .lean(true)
            .then(user => {
                const session = request.params.session || request.headers.authorization;
                if (!user) {
                    return callback(null, false);
                } else if (user.sessions.indexOf(session) === -1) {
                    return callback(null, false);
                } else {
                    request.auth.user = user;
                    return callback(null, true);
                }
            });
    }

    register(server: Hapi.Server, db: IDatabase): Promise<any> {
        AuthJwtPlugin.db = db;
        return server.register(AuthJwt)
            .then(() => {
                server.auth.strategy('jwt', 'jwt', true, {
                    key: [config.JWT_KAY],
                    validateFunc: AuthJwtPlugin.validate,
                    verifyOptions: { algorithms: ['HS256'] }
                });
            }).catch(error => { throw error; });
    }
}

export = new AuthJwtPlugin();
