import * as fs from 'fs';

import { IDatabase } from '../';

export class Seeds {
    static async init(db: IDatabase): Promise<void> {
        const files = fs.readdirSync(__dirname)
            .filter(file => file !== 'index.js' && !file.endsWith('.map'));

        console.log('Loading database seeds:');
        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].split('.js')[0];
            const seed: IDatabaseSeed = require(`./${fileName}`);
            const isSeeded = await seed.seed(db);
            console.log(`   [ ${fileName} ] : ${isSeeded}`);
        }
    }
}

export interface IDatabaseSeed {
    seed(db: IDatabase): Promise<boolean>;
}
