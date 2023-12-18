import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from './server/server.js';
import { Socket } from './socket/socket.js';

const server = new Server();

const socket = new Socket(server.server);


server.listen();