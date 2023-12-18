// import { Calificacion } from "../../models/index.js";

const getCalificacion = async(idU, query) => {
    try {
        if (idU === null && query === null)
            return await Calificacion.find();
        else
        if (query === null){
            return await Calificacion.findById(idU);
        }
        else
            return await Calificacion.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postCalificacion = async(body) => {
    try {
        const calificacion = new Calificacion({...body });

        return await calificacion.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putCalificacion = async(id, body) => {
    try {
        return await Calificacion.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delCalificacion = async(id) => {
    try {
        return await Calificacion.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getCalificacion, postCalificacion, putCalificacion, delCalificacion };