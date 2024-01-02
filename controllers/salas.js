import { response, request } from 'express';
// import * as services from '../services/index.js';
import * as services from '../services/index.js';


// este se usa
const obtenerSala = async (salaa, usuario, usuario2) => {
    try {
        // const { id } = req.headers;
        // if(!salaa){
            const salaReview = await services.prisma.salas.getSalaReviw(usuario, usuario2);
            if (salaReview != '' || salaReview != undefined || salaReview != null) {
             
                return salaReview;
            }else{
                return crearSala(usuario, usuario2);
            }
        // }else{
        //     const sala = await services.prisma.salas.getSalaById(salaa);
        //     return sala;
        // }
        // return res.status(200).json(sala);
    }
    catch (error) {
        console.error(error.message);
        return error;
        // return res.status(404).json({ msg: error.message });
    }
}

//este service ya contiene las rutas del prisma en las salas
const obtenerSalas = async (req = request, res = response) => {
    try {
        const {empleador, freelancer} = req.headers;

        const salas = (empleador) 
            ? await services.prisma.salas.getSalas(null, {empleador})
            : await services.prisma.salas.getSalas(null, {freelancer});

        return res.status(200).json(salas);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const obtenerSalaUser = async (usuario, usuario2) => {
    try {
            const salaReview = await services.prisma.salas.getSalaForUser(usuario, usuario2);
            return salaReview;
    }
    catch (error) {
        console.error(error.message);
        return error;
        // return res.status(404).json({ msg: error.message });
    }
}


//obtiene listado de salas
const obtenerListadoSalas = async (user) => {
    try {
        // const { desde, hasta, mensa } = req.headers;

        const salas = await services.prisma.salas.obtenerListado(user);

        // return res.status(200).json(salas);
        return salas;
    }
    catch (error) {
        console.error(error.message);

        // return res.status(404).json({ msg: error.message });
    }
}

const crearSala = async ( usuario, usuario2) => {
    try {

        const sala = await services.prisma.salas.createSala(usuario, usuario2);

        return sala;
    }
    catch (error) {
        console.error(error.message);

        // return res.status(404).json({ msg: error.message });
    }
}
// const actualizarStatusSala = async ( room) => {
//     try {

//         const sala = await services.prisma.salas.actualizarSala(room);

//         return sala;
//     }
//     catch (error) {
//         console.error(error.message);

//         // return res.status(404).json({ msg: error.message });
//     }
// }

const eliminarSala = async (req = request, res = response) => {
    try {
        const { id } = req.headers;

        const sala = await services.prisma.salas.deleteSala(id);

        return res.status(200).json(sala);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

export {
    obtenerSala,
    obtenerSalas,
    crearSala,
    eliminarSala,
    obtenerSalaUser,
    obtenerListadoSalas,
    // actualizarStatusSala
}




