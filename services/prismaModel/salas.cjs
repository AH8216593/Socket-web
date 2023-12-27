
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
    const obtenerListado = await prisma.$queryRaw`
       SELECT s.id, s.activo,	
(SELECT count(me.id)
FROM mensajes me
WHERE me.sala = s.id
AND me.usuario <> ${userId}
AND me.estado = 0 ) as mensajespendientes,
(SELECT me.mensaje
FROM mensajes me
WHERE me.sala = s.id
ORDER BY me.id
DESC LIMIT 1) as ultimomensaje,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.idusuario
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.idusuario
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as idusuario,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.nombre
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.nombre
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as nombre,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.apellidopaterno
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.apellidopaterno
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as apellidopaterno,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.apellidomaterno
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.apellidomaterno
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as apellidomaterno,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.idrol
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.idrol
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as idrol,
(if( s.freelancer = ${userId}, ( 
	SELECT ro.rol
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	INNER JOIN rol ro ON ro.idrol = uu.idrol
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT ro.rol
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	INNER JOIN rol ro ON ro.idrol = uu.idrol
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as rol,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.urlfoto
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.urlfoto
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as urlfoto,
(if( s.freelancer = ${userId}, ( 
	SELECT uu.idpais
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT uu.idpais
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as idpais,
(if( s.freelancer = ${userId}, ( 
	SELECT pp.pais
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT pp.pais
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as pais,
(if( s.freelancer = ${userId}, ( 
	SELECT pp.idregion
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT pp.idregion
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as idregion,
(if( s.freelancer = ${userId}, ( 
	SELECT rr.region
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.empleador
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	INNER JOIN region rr ON rr.idregion = pp.idregion
	WHERE ss.id = s.id
	LIMIT 1
), (SELECT rr.region
	FROM sala ss
	INNER JOIN usuario uu ON uu.idusuario = ss.freelancer
	INNER JOIN pais pp ON uu.idpais = pp.idpais
	INNER JOIN region rr ON rr.idregion = pp.idregion
	WHERE ss.id = s.id
	LIMIT 1
) ) ) as region
FROM sala s
INNER JOIN mensajes m on m.sala = s.id
WHERE s.freelancer = ${userId}
OR s.empleador = ${userId}
group by s.id
order by m.id DESC;
    `;


      // const resultadoFormateado = obtenerListado.map((sala) => ({
      //   id: sala.id && sala.id.toString(),
      //   activo: sala.activo,
      //   mensajespendientes: sala.mensajespendientes && sala.mensajespendientes.toString(),
      //   ultimomensaje: sala.ultimomensaje && sala.ultimomensaje.toString(),
      //   idusuario: sala.idusuario && sala.idusuario.toString(),
      //   nombre: sala.nombre,
      //   apellidopaterno: sala.apellidopaterno,
      //   apellidomaterno: sala.apellidomaterno,
      //   idrol: sala.idrol && sala.idrol.toString(),
      //   rol: sala.rol,
      //   urlfoto: sala.urlfoto,
      //   idpais: sala.idpais && sala.idpais.toString(),
      //   pais: sala.pais,
      //   idregion: sala.idregion && sala.idregion.toString(),
      //   region: sala.region,
      // }));

      const resultadoFormateado = obtenerListado.map((sala) => JSON.parse(JSON.stringify(sala, (key, value) => (typeof value === 'bigint' ? value.toString() : value))));


      console.log('obtener listado ' + resultadoFormateado);
      return resultadoFormateado;
    
  } catch (error) {
    throw error
  }
}

//Actualiza estatus de sala cuando se lee el mensaje
async function actualizarSala  (room) {
  const Sala = parseInt(room, 10);
  try {
    const updateSala = await prisma.sala.update({
      where: {
        id: room
      },
      data: {
        activo: false
      }
    });

    console.log('update de sala correcto');
    return updateSala;

  } catch (error) {
    throw error;
  }
};


module.exports =  { getSalaById, deleteSala, createSala, getSalaReviw, getSalaForUser, obtenerListado, actualizarSala} ;