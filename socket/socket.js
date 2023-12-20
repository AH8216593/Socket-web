import { Server as SocketServer } from "socket.io";
// import * as services from '../services/index.js';
import * as services from '../controllers/index.js'

class Socket {
	constructor(server) {
		this.io = new SocketServer(server, {
			cors: {
				origin: "*",
				methods: ['*']
			},
		});

		this.socketEvents();
	}

	socketEvents() {
        this.io.on('connection', (client) => {
            console.log('a user connected: ' + client.id);

            client.on("iniciarSocket", async(data) => {
				try {
					if (!data)
						throw new Error(`El usuario es necesario: ${JSON.stringify(data)}`);
	
					const usuario = await services.usuarios.obtenerUsuario(data, null);
	
					if(!usuario)
						throw new Error(`El usuario no existe: ${JSON.stringify(data)}`);
	
					client.join(data.usuario);
	
					// return callback(data.usuario);
				} catch (error) {
					console.log(error);
				}
			});

			client.on("obtenerSalas", async (usuario , usuario2) =>{
				const getSalas = await services.salas.obtenerSalaUser(usuario, usuario2);
				if(!getSalas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);
				client.emit('responseSalas', getSalas.id)
				return (getSalas.id);
			});

            client.on("entrarChat", async(usuario, sala, usuario2) => {
				// console.log(data);
				try {
					const salas = await services.salas.obtenerSala(sala, usuario, usuario2);

					if(!salas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);

					if(!(salas.freelancer === usuario))
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);
					client.join(salas.id.toString());

					// para obtener la sala al iniciar
					client.emit("obtenerSala", salas.id)

					return (salas.id);
				} catch (error) {
					console.log(error);
				}
			});

            client.on("enviarMensaje", async(data) => {
				try {
					if(data.mensaje.trim() === '' || !data.usuario)
						throw new Error(`El mensaje, el usuario ${JSON.stringify(data)}`);
					const mensaje = await services.mensajes.crearMensaje({
						usuario: data.usuario,
						sala:  data.sala,
						mensaje: data.mensaje,
						tipo: (data.tipo) ? data.tipo : 'mensaje' 
					});

					if(!mensaje)
						throw new Error(`Error al guardar el mensaje: ${JSON.stringify(mensaje)}`);
					else
					console.log('mensaje guardado');
            			client.in(data.sala).fetchSockets();
						// client.broadcast.to(data.sala).emit("recibirMensaje", mensaje, (err, responses) => {
						client.emit("recibirMensaje", mensaje, (err, responses) => {
							console.log('llego al emit ' + mensaje);
							console.log("llegaron los  mensajes");

							if (err) {
								console.log("Hubo error", err);
								console.log("responses", responses);
							} else {
								console.log(responses); // one response per client
							}
						});
					}
						catch (error) {
						console.log(error);
					}
			});

			client.on("obtenerMensajes", async(mensa) => {
				console.log('mensa' + mensa);
				try {
					const menssages = await services.mensajes.obtenerMensajes(mensa);

					if(!menssages)
						throw new Error(`Error al conseguir los mensajes: ${JSON.stringify(menssages)}`);

					client.emit("todosMensajes", menssages, (err, responses) => {
						console.log('llego al emit ' + menssages);
		
						if (err) {
							console.log("Hubo error", err);
							console.log("responses", responses);
						} else {
							console.log(responses); // one response per client
						}
					});
					return menssages;
				} catch (error) {
					console.log(error);
				}
			});
			
          });
		  
		this.io.on("disconnect", () => {
			console.log("Usuario desconectado");
		});
	}

	emit(event, data) {
		this.io.emit(event, data);
	}

	broadcast(event, data) {
		this.io.broadcast.emit(event, data);
	}

	emitTo(event, data, socketId) {
		this.io.to(socketId).emit(event, data);
	}

	broadcastTo(event, data, socketId) {
		this.io.to(socketId).broadcast.emit(event, data);
	}

	emitToRoom(event, data, room) {
		this.io.to(room).emit(event, data);
	}

	broadcastToRoom(event, data, room) {
		this.io.to(room).broadcast.emit(event, data);
	}

	emitToRooms(event, data, rooms) {
		rooms.forEach((room) => {
			this.io.to(room).emit(event, data);
		});
	}

	broadcastToRooms(event, data, rooms) {
		rooms.forEach((room) => {
			this.io.to(room).broadcast.emit(event, data);
		});
	}

	emitToAllRooms(event, data) {
		this.io.emit(event, data);
	}

	broadcastToAllRooms(event, data) {
		this.io.broadcast.emit(event, data);
	}

	emitToAllExcept(event, data, socketId) {
		this.io.sockets.sockets.forEach((socket) => {
			if (socket.id !== socketId) {
				socket.emit(event, data);
			}
		});
	}

	broadcastToAllExcept(event, data, socketId) {
		this.io.sockets.sockets.forEach((socket) => {
			if (socket.id !== socketId) {
				socket.broadcast.emit(event, data);
			}
		});
	}

	emitToAllInRoom(event, data, room) {
		this.io.in(room).emit(event, data);
	}

	broadcastToAllInRoom(event, data, room) {
		this.io.in(room).broadcast.emit(event, data);
	}

	emitToAllInRooms(event, data, rooms) {
		rooms.forEach((room) => {
			this.io.in(room).emit(event, data);
		});
	}

	broadcastToAllInRooms(event, data, rooms) {
		rooms.forEach((room) => {
			this.io.in(room).broadcast.emit(event, data);
		});
	}

	emitToAllInAllRooms(event, data) {
		this.io.emit(event, data);
	}

	broadcastToAllInAllRooms(event, data) {
		this.io.broadcast.emit(event, data);
	}

	emitToAllInAllExcept(event, data, socketId) {
		this.io.sockets.sockets.forEach((socket) => {
			if (socket.id !== socketId) {
				socket.emit(event, data);
			}
		});
	}

	broadcastToAllInAllExcept(event, data, socketId) {
		this.io.sockets.sockets.forEach((socket) => {
			if (socket.id !== socketId) {
				socket.broadcast.emit(event, data);
			}
		});
	}

	emitToAllInAllInRoom(event, data, room) {
		this.io.in(room).emit(event, data);
	}

	broadcastToAllInAllInRoom(event, data, room) {
		this.io.in(room).broadcast.emit(event, data);
	}

	emitToAllInAllInRooms(event, data, rooms) {
		rooms.forEach((room) => {
			this.io.in(room).emit(event, data);
		});
	}
}

export { Socket };
