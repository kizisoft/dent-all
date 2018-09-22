import config from '../../config';
import { IDatabaseSeed } from './';
import { IDatabase } from '../';
import { IUser } from '../../modules/users/user-model';

const admin = <IUser>{
    firstName: 'Ivan',
    lastName: 'Kizirian',
    email: 'kizisoft@gmail.com',
    scope: ['admin'],
    hashPassword: config.ADMIN_USER_SEED_PASSWORD
};

class AdminUserSeed implements IDatabaseSeed {
    seed(db: IDatabase): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.users.findOne({ email: admin.email })
                .then(user => {
                    if (user) {
                        return resolve(false);
                    } else {
                        return db.users.create(admin);
                    }
                })
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    }
}

export = new AdminUserSeed();
