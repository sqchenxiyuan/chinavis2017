const cluster = require("cluster")
const moment = require("moment")
const fs = require("fs")
const path = require("path")

class Record{
    constructor(barid, personid, onlinetime, offlinetime){
        this.barid = barid
        this.personid = personid
        this.onlinetime = onlinetime
        this.offlinetime = offlinetime

        if (this.isOk()){
            //转换为时间戳
            this.onlinetime = moment(this.onlinetime, "YYYYMMDDHHmmss").valueOf()
            this.offlinetime = moment(this.offlinetime, "YYYYMMDDHHmmss").valueOf()
        }
    }

    isOk(){
        if (this.barid && this.personid && this.onlinetime && this.offlinetime) return true
        return false
    }
}

class Person{
    constructor(id, name, sex, areaid, birthday){
        this.id = id
        this.name = name
        this.sex = sex
        this.areaid = areaid
        this.birthday = birthday

        if (this.isOk()){
            //过滤变量损坏的情况
            if (this.sex === "男"){
                this.sex = 1
            } else if (this.sex === "女"){
                this.sex = 2
            } else {
                this.sex = null
            }
            
            //转换为时间戳
            this.birthday = moment(this.birthday, "YYYYMMDD").valueOf()
        }
    }

    isOk(){
        if (this.id && this.name && this.sex && this.areaid && this.birthday) return true
        return false
    }
}

async function run(){
    let data1 = await readRecordsData(path.resolve(__dirname, "./hydata_swjl_0.csv"))
    let data2 = await readRecordsData(path.resolve(__dirname, "./hydata_swjl_1.csv"))
    let data = data1.concat(data2)
    let {records, persons} = resolveRecordsData(data)
    console.log(`原始:${data.length}`)
    console.log(`处理后:${records.length}`)

    

    //记录文件
    let recordsstr = records.map(data => {
        return `INSERT INTO records (barid, personid, onlinetime, offlinetime) VALUES ("${data.barid}", "${data.personid}", ${data.onlinetime}, ${data.offlinetime});`
    }).join("\r\n")

    //记录文件
    let personsmap = new Map()
    persons.forEach(p => {
        if (!personsmap.has(p.id)){
            personsmap.set(p.id, p)
        }
    })
    persons = [...personsmap.values()]
    console.log(`人数:${personsmap.size}`)
    let personstr = persons.map(data => {
        return `INSERT INTO persons (id, name, sex, areaid, birthday) VALUES ("${data.id}", "${data.name}", ${data.sex}, "${data.areaid}", ${data.birthday});`
    }).join("\r\n")
    

    let buff = Buffer.from(`${recordsstr}\r\n${personstr}`, "utf8")
    fs.writeFile(path.resolve(__dirname, "./data.sql"), buff, (err, data) => {
        if (err){
            console.error(err)
            reject(err)
        }
        console.log("ok")
    })
}
run().catch(err => {
    console.error(err)
})

//读取文件数据
function readRecordsData(filepath){
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err){
                console.error(err)
                reject(err)
            }
            let str = data.toString("utf8")
            let strarr = str.split("\n")
            //去除第一行
            strarr = strarr.slice(1)
            resolve(strarr)
        })
    })
}

//处理数据
function resolveRecordsData(datas){
    let records = []
    let persons = []

    for (let i = 0; i < datas.length; i++){
        let data = datas[i].split(",").map(data => data.replace(/(^")|("$)/g, ""))
        let record = new Record(data[1], data[0], data[4], data[5])
        let person = new Person(data[0], data[3], data[2], data[6], data[7])

        if (record.isOk() && person.isOk()){
            records.push(record)
            persons.push(person)
        }
    }

    return {
        records,
        persons
    }
}