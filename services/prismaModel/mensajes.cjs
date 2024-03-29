const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// import * as services from '../index';
// un usuario
 async function createMensaje (req, fecha) {
  const user = parseInt(req.usuario, 10);
  const fechaMovil = new Date(req.fechaDispositivo);
  console.log(req);
  try {
    const newMensaje =  await prisma.mensajes.create({
      data: {
      sala: req.sala,
      usuario:  user,
      tipo:   req.tipo,
      mensaje:   req.mensaje,
      fecha:    fecha,
      estado: req.estado,
      fecha_dispositivo: fechaMovil,
      nombreImagen: req.nombreImagen
      },
    });
    console.log('mensaje Creado');
    return newMensaje;
  } catch (error) {
    throw error;
  }
  
}
// obtiene mensajes sala por ID
async function getMensajeById  (mensaje) {
  try {
    const  getMensajeId = await prisma.mensajes.findMany({
      where: {
        sala: mensaje
      },
      orderBy: {
          fecha: 'asc'
      }
    }) 
    console.log("todos los mensajes " + getMensajeId);
    return getMensajeId;
  } catch (error) {
    throw error;
  }
  // return getSalaById;

};
//Obtiene todas las salas
async function getMensajes() {
    try {
      const  getMensajes = await prisma.mensajes.findMany({
        
      }) 
      return getMensajes;
    } catch (error) {
      throw error;
    // return getSalaById;
  };
}

async function updateMensajes(mensajeId) {
    try {
      const  getMensajes = await prisma.mensajes.update({
        where: {
            idMensaje: mensajeId
        }
      }) 
    } catch (error) {
      throw error;
    // return getSalaById;
  };
}


// Elimina todas las salas
async function deleteMensale ( mensajeId){
  try {
    const deleteMensaje = await prisma.mensajes.delete({
      where: {
        id: parseInt(mensajeId)
      }
      });
    
  } catch (error) {
    throw error
  }
}

async function actualizarMensaje  (user, room) {
  const Sala = parseInt(room, 10);
  try {
    const updateSala = await prisma.mensajes.updateMany({
      where: {
        sala: room,
        usuario: user
      },
      data: {
        estado: true,
      },
    });

    console.log('update de mensaje correcto');
    return updateSala;

  } catch (error) {
    throw error;
  }
};

module.exports =   {getMensajes, createMensaje, getMensajeById, deleteMensale, updateMensajes, actualizarMensaje };