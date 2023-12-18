
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSalaById  (data) {
  const Sala = parseInt(data, 10);
  try {
    const  getSalaId = await prisma.sala.findUnique({
      where: {
        id: Sala
      }
    }); 
    return getSalaId;

  } catch (error) {
    throw error;
  }
};
async function getSalaReviw  (usuario, usuario2) {
  try {
    const  getsala = await prisma.sala.findMany({
      where:{
        freelancer:{
          contains: usuario
        },
        empleador:{
          contains: usuario2
        }
      }
      // where: {
      //   freelancer: usuario,
      //   empleador: usuario2
      // }
    }); 
    return getsala;

  } catch (error) {
    throw error;
  }
};

async function createSala(usuario, usuario2entarda){
  try {
    const salaCreada = await prisma.sala.create({
      data: {
        freelancer: usuario,
        empleador: usuario2entarda,
        proyecto: 'mensajes',
        activo: true,
        cierre: 1,
        estado: true
      },
    });

    return salaCreada
  } catch (error) {
    console.error('Error al crear la sala:', error);
  }
}
// Elimina todas las salas
async function deleteSala ( salaId){
  try {
    const deleteSala = await prisma.sala.delete({
      where: {
        id: parseInt(salaId)
      }
      });
    
  } catch (error) {
    throw error
  }
}


module.exports =  { getSalaById, deleteSala, createSala, getSalaReviw} ;