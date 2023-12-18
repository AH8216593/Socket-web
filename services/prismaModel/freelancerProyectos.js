// import { FreelancerProyecto } from "../../models/index.js";

const getFreelancerProyecto = async(idU, query) => {
    try {
        if (idU === null && query === null)
            return await FreelancerProyecto.find();
        else
        if (query === null){
            return await FreelancerProyecto.findById(idU);
        }
        else
            return await FreelancerProyecto.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postFreelancerProyecto = async(body) => {
    try {
        const freelancerProyecto = new FreelancerProyecto({...body });

        return await freelancerProyecto.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putFreelancerProyecto = async(id, body) => {
    try {
        return await FreelancerProyecto.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delFreelancerProyecto = async(id) => {
    try {
        return await FreelancerProyecto.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getFreelancerProyecto, postFreelancerProyecto, putFreelancerProyecto, delFreelancerProyecto };