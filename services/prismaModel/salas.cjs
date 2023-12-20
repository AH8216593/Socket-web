
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

    console.log('se obtiene una sola sala');
    return getSalaId;

  } catch (error) {
    throw error;
  }
};
async function getSalaReviw  (usuario, usuario2) {
  try {
    const  getsala = await prisma.sala.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                freelancer: usuario,
                empleador: usuario2,
              },
              {
                freelancer: usuario2,
                empleador: usuario,
              },
            ],
          },
        ],
      },
    }); 

    console.log('se obtiene sala ');
    return getsala;

  } catch (error) {
    throw error;
  }
};

async function getSalaForUser  (usuario, usuario2) {
  try {
    const  getsala = await prisma.sala.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                freelancer: usuario,
                empleador: usuario2,
              },
              {
                freelancer: usuario2,
                empleador: usuario,
              },
            ],
          },
        ],
      },
    }); 

    // console.log('se obtiene sala' + getsala);
    console.log('IDs de salas:', getsala.map(sala => sala.id));

    return getsala.map(sala=> sala.id);

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

    console.log('sala creada');
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


module.exports =  { getSalaById, deleteSala, createSala, getSalaReviw, getSalaForUser} ;