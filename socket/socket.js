import { Server as SocketServer } from "socket.io";
// import * as services from '../services/index.js';
import * as services from '../controllers/index.js';
import * as aws from '../util/amazonBucketManager.js';

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
				
					let arrayComplet = await JSON.parse( JSON.stringify(salas));
					let array2 =  await JSON.parse(arrayComplet);
					console.log(arrayComplet, 'arraycomplet');
					client.join(array2[0].id.toString());

					// para obtener la sala al iniciar
					client.emit("obtenerSala", array2[0].id)

				} catch (error) {
					console.log(error);
				}
			});

			// ya esta ok
			client.on("cargarImagenes", async( dataImages) =>{
				// console.log(file);
				let image = dataImages.dataImages;
				let mesje = dataImages.data;

				console.log( mesje.fechaDispositivo + image.name , 'fecha dispo');
					if(!mesje.usuario || mesje.sala === '')
						throw new Error(`El mensaje, el usuario, no se manda la sala ${JSON.stringify(mesje)}`);
						const mensaje = await services.mensajes.crearMensaje({
							usuario: mesje.usuario,
							sala:  mesje.sala,
							mensaje: '',
							tipo: 'imagen',
							estado: mesje.estado,
							fechaDispositivo: mesje.fechaDispositivo,
							nombreImagen: mesje.fechaDispositivo + image.name 
						});
	
						if(!mensaje)
							throw new Error(`Error al guardar el mensaje: ${JSON.stringify(mensaje)}`);
						else
						await aws.uploadPhotoTochat(image, mesje.fechaDispositivo + image.name );
						let url =	await aws.getChatPhotoByTheName( mesje.fechaDispositivo + image.name );
						console.log('URL: ' , url);
						console.log('archivo guardado ');
							client.in(mesje.sala).fetchSockets();
							client.to(mesje.sala).emit("recibirMensaje", mensaje, url, (err, responses) => {
								console.log('llego al emit ' + mensaje);
								console.log("llegaron los  mensajes de archivos");
								if (err) {
									console.log("Hubo error", err);
									console.log("responses", responses);
								} else {
									console.log(responses); // one response per client
								}
							});
				
			});

			// este ya esta ok
            client.on("enviarMensaje", async(dataImages) => {
				// client.in(data.sala).fetchSockets();
				let image = dataImages.dataImages;
				let mesje = dataImages.data;
				try {

					if (mesje.mensaje.trim() === '') {
						// se hace una primera conexion para poder inicar los mensajes
						console.log('entro al primer paso del socket');
						client.in(mesje.sala).fetchSockets();

					}else{
						//valida que el objeto files tenga data para mandarlo con un mensaje
						if(image.name == ''){
								if(!mesje.usuario || mesje.sala === '')
								throw new Error(`El mensaje, el usuario, no se manda la sala ${JSON.stringify(mesje)}`);
								const mensaje = await services.mensajes.crearMensaje({
									usuario: mesje.usuario,
									sala:  mesje.sala,
									mensaje: mesje.mensaje,
									tipo:  'mensaje',
									estado: mesje.estado,
									fechaDispositivo: mesje.fechaDispositivo,
									nombreImagen: ''
								});

								if(!mensaje)
									throw new Error(`Error al guardar el mensaje: ${JSON.stringify(mensaje)}`);
								else
								console.log('mensaje guardado');
									client.in(mesje.sala).fetchSockets();
									client.to(mesje.sala).emit("recibirMensaje", mensaje, (err, responses) => {
										console.log('llego al emit ' + mensaje);
										console.log("llegaron los  mensajes");

										if (err) {
											console.log("Hubo error", err);
											console.log("responses", responses);
										} else {
											console.log(responses); // one response per client
										}
									});

						}else{
							// se manda mensaje con archivo con upload
							console.log( mesje.fechaDispositivo + image.name , 'fecha dispo');
							if(!mesje.usuario || mesje.sala === '')
								throw new Error(`El mensaje, el usuario, no se manda la sala ${JSON.stringify(mesje)}`);
								const mensaje = await services.mensajes.crearMensaje({
									usuario: mesje.usuario,
									sala:  mesje.sala,
									mensaje: mesje.mensaje,
									tipo: 'imagen',
									estado: mesje.estado,
									fechaDispositivo: mesje.fechaDispositivo,
									nombreImagen: mesje.fechaDispositivo + image.name 
								});
			
								if(!mensaje)
									throw new Error(`Error al guardar el mensaje: ${JSON.stringify(mensaje)}`);
								else
								await aws.uploadPhotoTochat(image, mesje.fechaDispositivo + image.name );
								let url =	await aws.getChatPhotoByTheName( mesje.fechaDispositivo + image.name );
								console.log('URL: ' , url);
								console.log('archivo guardado ');
									client.in(mesje.sala).fetchSockets();
									client.to(mesje.sala).emit("recibirMensaje", mensaje, url, (err, responses) => {
										console.log('llego al emit ' + mensaje, url);
										console.log("llegaron los  mensajes de archivos");
										if (err) {
											console.log("Hubo error", err);
											console.log("responses", responses);
										} else {
											console.log(responses); // one response per client
										}
									});
								
						}

						
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

					//notas en el mensaje como regresa varios objetos se debe de recorrer para mandar a traer imagen 
					if(!menssages)
						throw new Error(`Error al conseguir los mensajes: ${JSON.stringify(menssages)}`);
						// let url;
						  menssages.forEach( async respo => {
							if (respo.nombreImagen.trim() == '') {
								respo.url = '';
							}else{
								respo.url  = await aws.getChatPhotoByTheName(respo.nombreImagen);
							}

							 client.emit("todosMensajes",  menssages,  (err, responses) => {
								console.log('llego a emit ' + menssages );
				
								if (err) {
									console.log("Hubo error", err);
									console.log("responses", responses);
								} else {
									console.log(responses); // one response per client
								}
							});
						});
					
					// return menssages;
				} catch (error) {
					console.log(error);
				}
			});

			// actualizar status de la sala (mensaje leido)
			client.on("mensajeLeido", async (data) =>{
				const getSalaId = await services.mensajes.actualizarStatusMensaje(data.usuario, data.sala);
				if(!getSalaId)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(getSalaId)}`);
					return (getSalaId);
			});

			//Obtiene la lista del menu princpial de mensajes pendientes
			client.on("obtenerMensajesPrincipal", async (usuario) =>{
				const getSalas = await services.salas.obtenerMensajesPrincipal(usuario);
				if(!getSalas)
						throw new Error(`Error al conseguir las salas: ${JSON.stringify(getSalas)}`);
					console.log('salas listado general  ----' + getSalas);
					client.emit('responseMensajesPrincipal', getSalas);
					return (getSalas);

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
