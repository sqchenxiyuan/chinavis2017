import axios from "./axios.js"

export function queryBars(obj = {}){
    let {
        offset,
        limit
    } = obj

    return axios.get("http://10.10.9.233:8080/bars")
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

export function queryBarsInfo(obj = {}){
    return axios.get("http://10.10.9.233:8080/filterinfo", {
        params: {
            startTime: 1475251200,
            endTime: 1482768000,
            minAge: 0,
            maxAge: 1000,
            maxInternetTime: 100000000000,
            minInternetTime: 0,
        }
    })
}

export function queryAgeCount(obj = {}){
    return axios.get("http://10.10.9.233:8080/age-count")
}

export function queryInternetTimeDistribution(obj = {}){
    let {
        startTime,
        endTime,
    } = obj

    return axios.get("http://10.10.9.233:8080/internet-time-distribution", {
        params: {
            startTime,
            endTime,
        }
    })
}