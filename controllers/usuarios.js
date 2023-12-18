import { response, request } from 'express';
import * as services from '../services/index.js';

const obtenerUsuario = async (data, res = response) => {
    try {
        // const { email } = req.headers;


        const usuario = await services.prisma.usuarios.getUniqueUser(data);

        // return res.status(200).json({ usuario: usuario[0] });
        return usuario;
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const obtenerUsuarios = async (req = request, res = response) => {
    try {
        const { estado } = req.headers;
        let usuarios;

        usuarios = (estado) ? await services.mongo.usuarios.getUsuario(null, { estado })
            : await services.mongo.usuarios.getUsuario(null, {});

        return res.status(200).json(usuarios);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const crearUsuario = async (req = request, res = response) => {
    try {
        const { email, nombre, rol, imagen, ubicacion, informacion } = req.body;

        const usuario = await services.mongo.usuarios.postUsuario({ email, nombre, rol, imagen, ubicacion, informacion });

        return res.status(201).json(usuario);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const actualizarUsuario = async (req = request, res = response) => {
    try {
        const { nombre, imagen, ubicacion, informacion, id } = req.body;

        const usuario = await services.mongo.usuarios.putUsuario(id, { nombre, imagen, ubicacion, informacion });

        return res.status(200).json(usuario);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

const eliminarUsuario = async (req = request, res = response) => {
    try {
        const { id } = req.headers;

        const usuario = await services.mongo.usuarios.delUsuario(id);

        return res.status(200).json(usuario);
    }
    catch (error) {
        console.error(error.message);

        return res.status(404).json({ msg: error.message });
    }
}

export {
    obtenerUsuario,
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}