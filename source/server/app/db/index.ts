import * as Mongoose from 'mongoose';

import config from '../config';
import { IUser, UserModel } from '../modules/users/user-model';
import { Seeds } from './seeds';

export class Database implements IDatabase {
    readonly users: Mongoose.Model<IUser> = UserModel;

    static async init(): Promise<IDatabase> {
        const database = new Database();
        return new Promise<IDatabase>((resolve, reject) => {
            (<any>Mongoose).Promise = Promise;

            Mongoose.connect(config.CONNECTION_STRING, { useMongoClient: true }).catch(error => reject(error));
            const db = Mongoose.connection;

            db.on('error', (error) => {
                console.log(`Unable to connect to database: ${config.CONNECTION_STRING}`);
                return reject(error);
            });

            db.once('open', async () => {
                console.log(`Connected to database: ${config.CONNECTION_STRING}`);

                // Seeds the database
                await Seeds.init(database);

                return resolve(database);
            });
        });
    }
}

export interface IDatabase {
    readonly users: Mongoose.Model<IUser>;
}
