const axios = require("axios")

let instance = axios.create({
    baseURL: "http://127.0.0.1:3000/",
    timeout: 3000
})

export default instance