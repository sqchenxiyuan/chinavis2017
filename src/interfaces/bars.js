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
        interval,
        barIds,
    } = obj

    let formdata = new FormData()
    formdata.set("startTime", startTime)
    formdata.set("endTime", endTime)
    formdata.set("interval", interval)
    if (barIds) formdata.set("barIds", barIds)

    return axios.post("http://10.10.9.233:8080/internet_users", formdata)
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


export function queryAgeCount(obj = {}){
    return axios.get("http://10.10.9.233:8080/age-count")
}