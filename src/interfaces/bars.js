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
        ageTime
    } = obj

    let formdata = new FormData()
    formdata.set("startTime", startTime)
    formdata.set("endTime", endTime)
    formdata.set("interval", interval)
    if (barIds) formdata.set("barIds", barIds)
    if (ageTime) formdata.set("ageTime", ageTime)

    return axios.post("http://10.10.9.233:8080/internet_users", formdata)
}

export function queryBarsInfo(obj = {}){
    let {
        startTime,
        endTime,
        ageTime
    } = obj


    let formdata = new FormData()
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
    } = obj

    let formdata = new FormData()
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
    } = obj

    let formdata = new FormData()
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
    } = obj

    let formdata = new FormData()
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
    } = obj

    let formdata = new FormData()
    formdata.set("maxInternetTime", maxTime)
    formdata.set("interval", interval)
    if (startTime) formdata.set("startTime", startTime)
    if (endTime) formdata.set("endTime", endTime)
    if (barIds) formdata.set("barIds", barIds)

    return axios.post("http://10.10.9.233:8080/age_time", formdata)
}

export function exportData(){
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
