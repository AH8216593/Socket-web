import mysql from 'mysql'

const dbConnection = () => {
     var connection  = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWRD,
        database: process.env.DB_DATABASE,
        port: 3306
     });
      connection.connect(function(error){
        if(error){
           throw error;
        }else{
           console.log('Conexion correcta a la BD.');
        }
     });
}

export default {
    dbConnection
}