import config from './app/config';
import Server from './server';

console.log(`Running enviroment [ ${config.ENV} ]`);

// Setup the server
Server.init()
    .then(server => {
        // Start server
        return server.start().then(() => console.log('Server running at:', server.info.uri));
    })
    .catch(error => {
        console.log(error.message);
        throw new Error(error);
    });
