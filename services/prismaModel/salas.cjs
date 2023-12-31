
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


//obtiene la sala que 
async function getSalaReviw  (usuario, usuario2) {
  try {
    const  getsala = await prisma.sala.findMany({
      // where: {
      //   AND: [
      //     {
      //       OR: [
      //         {
      //           freelancer: usuario,
      //           empleador: usuario2,
      //         },
      //         {
      //           freelancer: usuario2,
      //           empleador: usuario,
      //         },
      //       ],
      //     },
      //   ],
      // },

      where: {
        OR: [
          { freelancer: usuario, empleador: usuario2 },
          { freelancer: usuario2, empleador: usuario },
        ],
      },
    }); 

    console.log('se obtiene sala ');
    return JSON.stringify(getsala);

  } catch (error) {
    throw error;
  }
};


//obtiene sala la sala por usuario 
async function getSalaForUser  (usuario, usuario2) {
  try {
    const  getsala = await prisma.sala.findMany({
      where: {
        OR: [
          { freelancer: usuario, empleador: usuario2 },
          { freelancer: usuario2, empleador: usuario },
        ],
      }
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
    return JSON.stringify([salaCreada]);
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
order by mensajespendientes DESC;
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

//obtiene los chats primcipales en el menu 
async function obtenerMensajesPrincipalLista  (usuario) {
  try {
    const getsala = await prisma.$queryRaw`
        SELECT count(me.sala) as chatsconmensajespendientes
        FROM sala s
        INNER JOIN mensajes me ON me.sala = s.id
        WHERE me.usuario <> ${usuario}
        AND s.id IN (SELECT ss.id FROM sala ss WHERE ss.freelancer = ${usuario} OR ss.empleador = ${usuario}  )
        AND me.estado = 0;
    `;


    // const chatsConMensajesPendientes = getsala.map(item => ({
    //   chatsconmensajespendientes: item.chatsConMensajesPendientes.toString(),
    // }));
    

    console.log('se obtiene sala' + getsala);
    const objetoSerializado = JSON.stringify(getsala, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
    // console.log('Salas menu principal :', chatsConMensajesPendientes);

    return objetoSerializado;
    // return getsala;
  } catch (error) {
    throw error;
  }
};




module.exports =  { getSalaById, deleteSala, createSala, getSalaReviw, getSalaForUser, obtenerListado, obtenerMensajesPrincipalLista} ;