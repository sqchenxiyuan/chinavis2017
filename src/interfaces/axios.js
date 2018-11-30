const axios = require("axios")

let instance = axios.create({
    baseURL: "http://10.10.9.120:3000/",
    timeout: 1000
})

export default instance