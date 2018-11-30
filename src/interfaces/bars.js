import axios from "./axios.js"

export function queryBars(obj = {}){
    let {
        offset,
        limit
    } = obj

    return axios.get("/bars", {
        params: {
            offset,
            limit
        }
    })
}