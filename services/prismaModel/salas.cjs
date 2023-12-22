
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

async function obtenerListado (userId) {
  try {
    // const obtenerListado = await prisma.sala.findMany({
    //   select: {
    //     id: true,
    //     activo: true,
    //     mensajespendientes: {
    //       count: {
    //         where: {
    //           estado: 1,
    //           mensajes: {
    //             some: {
    //               estado: 1,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     ultimomensaje: {
    //       select: {
    //         mensaje: true,
    //       },
    //       where: {
    //         estado: 1,
    //       },
    //       orderBy: {
    //         id: 'desc',
    //       },
    //       take: 1,
    //     },
    //   },
    //   where: {
    //     OR: [
    //       {
    //         freelancer: userId,
    //       },
    //       {
    //         empleador: userId,
    //       },
    //     ],
    //   },
    //   include: {
    //     mensajes: {
    //       where: {
    //         estado: 1,
    //       },
    //       orderBy: {
    //         id: 'desc',
    //       },
    //     },
    //   },
    //   groupBy: {
    //     id: true,
    //     activo: true,
    //   },
    //   orderBy: {
    //     mensajes: {
    //       id: 'desc',
    //     },
    //   },  
    //   });


    const obtenerListado = await prisma.$queryRaw`
        SELECT s.id, s.activo, 
        (SELECT count(me.id)
        FROM mensajes me
        WHERE me.sala = s.id
        AND me.estado = 1) as mensajespendientes,
        (SELECT me.mensaje
        FROM mensajes me
        WHERE me.sala = s.id
        AND me.estado = 1
        ORDER BY me.id
        DESC LIMIT 1) as ultimomensaje
        FROM sala s
        INNER JOIN mensajes m on m.sala = s.id
        WHERE s.freelancer = ${userId}
        OR s.empleador = ${userId}
        group by s.id
        order by m.id DESC;
    `;


      const resultadoFormateado = obtenerListado.map((sala) => ({
        id: sala.id && sala.id.toString(), // Verificar si id está definido antes de llamar a toString
        activo: sala.activo,
        mensajespendientes: sala.mensajespendientes && sala.mensajespendientes.toString(), // Verificar si mensajespendientes está definido antes de llamar a toString
        ultimomensaje: sala.ultimomensaje && sala.ultimomensaje.toString(), // Verificar si ultimomensaje está definido antes de llamar a toString
      }));
      console.log('obtener listado ' + resultadoFormateado);
      return resultadoFormateado;
    
  } catch (error) {
    throw error
  }
}


module.exports =  { getSalaById, deleteSala, createSala, getSalaReviw, getSalaForUser, obtenerListado} ;