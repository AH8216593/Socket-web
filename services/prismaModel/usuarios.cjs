const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

  async function getUniqueUser(data)  {
    console.log(data);
    const usuarios = parseInt(data, 10);
    const user = await prisma.usuario.findUnique({
       where: {
        idUsuario: usuarios
       }
     });
   
     console.log(user);
     return user;
 }


 module.exports = {getUniqueUser}