import * as Hapi from 'hapi';

import config from '../config';
import { IDatabase } from '../db';

export class Plugins {
    static async init(server: Hapi.Server, db: IDatabase): Promise<void> {
        console.log('Register plugins:');
        for (let i = 0; i < config.PLUGINS.length; i++) {
            const plugin: IPlugin = require(`./${config.PLUGINS[i]}`);
            await plugin.register(server, db);
            console.log(`   [ ${plugin.name} ] - ${plugin.description}`);
        }
    }
}

export interface IPlugin {
    name: string;
    description: string;
    register(server: Hapi.Server, db: IDatabase): void;
}
