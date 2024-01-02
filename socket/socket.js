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
	
					// client.join(data.usuario);
				} catch (error) {
					console.log(error);
				}
			});

			//obenter todas las salas por ususario para notificar 
			client.on("obtenerListadoChats", async (data) =>{
				const getSalas = await services.salas.obtenerListadoSalas(data);
				if(!getSalas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(getSalas)}`);
					console.log('salas id  ----' + getSalas);
					client.emit('responseListadoChats', getSalas)
					return (getSalas);
			});


			client.on("obtenerSalas", async (data) =>{
				const getSalas = await services.salas.obtenerSalaUser(data.usuario, data.usuario2);
				if(!getSalas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);

					console.log('salas id  ----' + getSalas);
					client.emit('responseSalas', getSalas)
					return (getSalas.id);
			});

            client.on("entrarChat", async(data) => {
				// console.log(data);
				try {
					const salas = await services.salas.obtenerSala(data.sala, data.usuario, data.usuario2);

					if(!salas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);

					// if(!(salas.freelancer === usuario))
					// 	throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);
				// esta linea genera la conexion con el join entre una conversacion y otra
					client.join(salas[7]);
					// para obtener la sala al iniciar
					client.emit("obtenerSala", salas)

					// return (salas[7].id);
				} catch (error) {
					console.log(error);
				}
			});

            client.on("enviarMensaje", async(data) => {
				// client.in(data.sala).fetchSockets();
				try {
					if (data.mensaje.trim() === '') {
						// se hace una primera conexion para poder inicar los mensajes
						console.log('entro al primer paso del socket');
						client.in(data.sala).fetchSockets();

					}else{
						if(!data.usuario || data.sala === '')
						throw new Error(`El mensaje, el usuario, no se manda la sala ${JSON.stringify(data)}`);
						const mensaje = await services.mensajes.crearMensaje({
							usuario: data.usuario,
							sala:  data.sala,
							mensaje: data.mensaje,
							tipo: (data.tipo) ? data.tipo : 'mensaje',
							estado: data.estado
						});

						if(!mensaje)
							throw new Error(`Error al guardar el mensaje: ${JSON.stringify(mensaje)}`);
						else
						console.log('mensaje guardado');
							// client.in(data.sala).fetchSockets();
							client.to(data.sala).emit("recibirMensaje", mensaje, (err, responses) => {
							// client.broadcast.to(data.sala).emit("recibirMensaje", mensaje, (err, responses) => {
							// client.emit("recibirMensaje", mensaje, (err, responses) => {
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

			// actualizar status de la sala (mensaje leido)
			client.on("mensajeLeido", async (data) =>{
				const getSalaId = await services.mensajes.actualizarMensaje(data);
				if(!getSalaId)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(salas)}`);
					return (getSalaId);
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
