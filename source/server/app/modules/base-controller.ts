import { IDatabase } from '../db';

export interface IContorller {
    db: IDatabase;
}

export class BaseController implements IContorller {
    db: IDatabase;

    constructor(db: IDatabase) {
        this.db = db;
    }
}
