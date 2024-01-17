import { response, request } from 'express';
import * as services from '../services/index.js';

const obtenerMensaje = async (req = request, res = response) => {
    try {
        const { sala } = req.headers;

        const mensajes = await services.prisma.mensajes.getMensajes(null, {sala});

        return res.status(200).json(mensajes);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const obtenerMensajes = async (mensa) => {
    try {
        // const { desde, hasta, mensa } = req.headers;

        const mensajes = await services.prisma.mensajes.getMensajeById(mensa);

        // return res.status(200).json(mensajes);
        return mensajes;
    }
    catch (error) {
        console.error(error.message);

        // return res.status(404).json({ msg: error.message });
    }
}

// este se usa 
const crearMensaje = async (data,  res = response) => {
    try {
       
        const  fecha = new Date();
        const mensajes = await services.prisma.mensajes.createMensaje(data, fecha);
        
        // return res.status(200).json(mensajes);
        return mensajes;
    }
    catch (error) {
        console.error(error.message);
    }
}

const actualizarMensaje = async (req = request, res = response) => {
    try {
        const { mensaje, id } = req.body;

        (typeof mensaje == String);

        const mensajes = await services.prisma.mensajes.updateMensajes(id, { mensaje });

        return res.status(200).json(mensajes);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const eliminarMensaje = async (req = request, res = response) => {
    try {
        const { id } = req.headers;

        const mensaje = await services.mongo.mensajes.deleteMensale(id);

        return res.status(200).json(mensaje);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}
const actualizarStatusMensaje = async ( usuario, room) => {
    try {

        const mensajito = await services.prisma.mensajes.actualizarMensaje(usuario ,room);

        return mensajito;
    }
    catch (error) {
        console.error(error.message);

        // return res.status(404).json({ msg: error.message });
    }
}
export {
    obtenerMensaje,
    obtenerMensajes,
    crearMensaje,
    actualizarMensaje,
    eliminarMensaje,
    actualizarStatusMensaje
}