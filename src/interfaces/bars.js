import axios from "./axios.js"
import querystring from "querystring"

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
        ageTime,
        type = 0
    } = obj

    let formdata = new FormData()
    formdata.set("startTime", startTime)
    formdata.set("endTime", endTime)
    formdata.set("interval", interval)
    formdata.set("type", type)
    if (barIds) formdata.set("barIds", barIds)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/internet_users", formdata)
}

export function queryBarsInfo(obj = {}){
    let {
        startTime,
        endTime,
        ageTime,
        type = 0
    } = obj


    let formdata = new FormData()
    formdata.set("type", type)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/filterinfo", formdata)
}

export function queryInternetTimeDistribution(obj = {}){
    let {
        startTime,
        endTime,
        ageTime,
        barIds,
        type,
    } = obj

    let formdata = new FormData()
    formdata.set("type", type)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (barIds) formdata.set("barIds", barIds)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/internet-time-distribution", formdata)
}

export function queryAgeCount(obj = {}){
    let {
        startTime,
        endTime,
        ageTime,
        barIds,
        type = 0
    } = obj

    let formdata = new FormData()
    formdata.set("type", type)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (barIds) formdata.set("barIds", barIds)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/age-count", formdata)
}

export function queryProvinceUsercount(obj = {}){
    let {
        startTime,
        endTime,
        ageTime,
        barIds,
        type = 0
    } = obj

    let formdata = new FormData()
    formdata.set("type", type)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (barIds) formdata.set("barIds", barIds)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/province-usercount", formdata)
}

export function queryPersonTimeCount(obj = {}){
    let {
        startTime,
        endTime,
        barIds,
        maxTime,
        interval,
        type = 0
    } = obj

    let formdata = new FormData()
    formdata.set("maxInternetTime", maxTime)
    formdata.set("interval", interval)
    formdata.set("type", type)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (barIds) formdata.set("barIds", barIds)

    return axios.post("http://10.10.9.233:8080/age_time", formdata)
}

export function exportData(obj = {}){
    let {
        startTime,
        endTime,
        barIds,
        ageTime
    } = obj

    window.open(`http://10.10.9.233:8080/export-data?${querystring.stringify({
        startTime,
        endTime,
        barIds,
        ageTime
    })}`)
}
