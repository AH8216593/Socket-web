// import { CategoriaEmpleo } from "../../models/index.js";

const getCategoriaEmpleo = async(idU, query) => {
    try {
        if (idU === null && query === null)
            return await CategoriaEmpleo.find();
        else
        if (query === null){
            return await CategoriaEmpleo.findById(idU);
        }
        else
            return await CategoriaEmpleo.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postCategoriaEmpleo = async(body) => {
    try {
        const categoriaEmpleo = new CategoriaEmpleo({...body });

        return await categoriaEmpleo.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putCategoriaEmpleo = async(id, body) => {
    try {
        return await CategoriaEmpleo.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delCategoriaEmpleo = async(id) => {
    try {
        return await CategoriaEmpleo.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getCategoriaEmpleo, postCategoriaEmpleo, putCategoriaEmpleo, delCategoriaEmpleo };