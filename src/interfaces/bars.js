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

export function querySurfTheInternetRecords(obj = {}){
    let {
        startTime,
        endTime,
        interval
    } = obj

    return axios.get("http://10.10.9.233:8080/internet_users", {
        params: {
            startTime,
            endTime,
            interval
        }
    })
}

export function queryPersonTimeCount(obj = {}){
    let {
        maxTime,
        interval,
    } = obj

    return axios.get("http://10.10.9.233:8080/age_time", {
        params: {
            maxTime,
            interval
        }
    })
}