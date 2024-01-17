import express, { json, static as estatic } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { renewBucketToken } from '../util/amazonBucketManager.js';

import dbConnection from './database/config.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);

        // Conectar a base de datos
        this.conectarDB();
        // setInterval( renewBucketToken, 5000);
        setInterval( renewBucketToken, 1000* 50 * 60);
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Tareas programadas
        // this.crons();
    }

    async conectarDB() {
        renewBucketToken();
        await dbConnection.dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(json());

        // Directorio Público
        this.app.use(estatic('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        //this.app.use(this.paths.auth, routes.auths);
    }

    // crons() {
    //     //crons();
    // }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

export {
    Server
}