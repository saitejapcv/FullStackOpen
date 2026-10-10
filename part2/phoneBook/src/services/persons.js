import axios from "axios";

const baseURL = "http://localhost:3001/api/persons"

const getAll = () => {
    return axios.get(baseURL)
        .then(resoponse => resoponse.data)
}

const create = newObject => {
    const person = axios.post(baseURL, newObject)
        .then(resoponse => resoponse.data)
    return person
}

const deletePerson = id => {
    return axios
        .delete(`${baseURL}/${id}`)
        .then(resoponse => resoponse.data)
}

const changeNumber = (id, newObject) => {
    return axios
        .put(`${baseURL}/${id}`, newObject)
        .then(resoponse => resoponse.data)
}

export default { getAll, create, deletePerson, changeNumber }