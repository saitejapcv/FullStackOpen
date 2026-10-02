import axios from "axios";

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAll = () => {
    return axios.get(`${baseURL}/all`)
        .then(resoponse => resoponse.data.map(country => ({ name: country.name.common, id: country.cca3 })))
}

const getByName = name => {
    return axios.get(`${baseURL}/name/${name}`)
        .then(resoponse => resoponse.data)
}

export default { getAll, getByName }