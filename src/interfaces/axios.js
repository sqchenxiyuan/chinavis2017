const axios = require("axios")

let instance = axios.create({
    baseURL: "http://10.10.9.233:8080",
    timeout: 3000
})

export default instance