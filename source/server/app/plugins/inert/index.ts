import * as Hapi from 'hapi';
import * as Inert from 'inert';

import { IPlugin } from '../';

class InertPlugin implements IPlugin {
    name = 'inert';
    description = 'Static routes handler';

    register(server: Hapi.Server) {
        return server.register(Inert);
    }
}

export = new InertPlugin();
