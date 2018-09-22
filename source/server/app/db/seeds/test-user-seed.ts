import config from '../../config';
import { IDatabaseSeed } from './';
import { IDatabase } from '../';
import { IUser } from '../../modules/users/user-model';

const testUser = <IUser>{
    firstName: 'Diana',
    lastName: 'Dimitrova',
    email: 'ddimitr@gmail.com',
    scope: ['user'],
    hashPassword: config.ADMIN_USER_SEED_PASSWORD
};

class TestUserSeed implements IDatabaseSeed {
    seed(db: IDatabase): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.users.findOne({ email: testUser.email })
                .then(user => {
                    if (user) {
                        return resolve(false);
                    } else {
                        return db.users.create(testUser);
                    }
                })
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    }
}

export = new TestUserSeed();
