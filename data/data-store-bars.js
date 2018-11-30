async function saveBarsData(bars) {
    let barstr = bars.map(bar => {
        return `INSERT INTO bars (id, name, longitude, latitude) VALUES ("${bar.id}", "${bar.name}", ${bar.longitude}, ${bar.latitude});`
    }).join("\r\n")

    fs.writeFile(path.resolve(__dirname, "./bars.sql"), barstr, (err, data) => {
        if (err){
            console.error(err)
            reject(err)
        }
        console.log("ok")
    })
}

// asyncFunction()
const fs = require("fs")
const path = require("path")

class Bar{
    constructor(id, name, longitude, latitude){
        this.id = id
        this.name = name
        this.longitude = parseFloat(longitude)
        this.latitude = parseFloat(latitude)

        if (this.isOk()){
            //过滤变量损坏的情况
            this.name = this.name.replace(/）$/, "")
        }
    }

    isOk(){
        if (this.id && this.name && this.latitude && this.longitude) return true
        return false
    }
}


fs.readFile(path.resolve(__dirname, "./bars.csv"), (err, data) => {
    if (err){
        console.error(err)
        return
    }
    let str = data.toString("utf8")
    let strarr = str.split("\r\n")
    //去除第一行
    strarr = strarr.slice(1)
    
    let bars = []

    console.log("处理前：", strarr.length)
    strarr.forEach((data, index) => {
        let bar = new Bar(...(data.split(",")))

        //过滤缺损的情况
        if (bar.isOk()){
            bars.push(bar)
        }
    })
    console.log("处理后：", bars.length)

    saveBarsData(bars).catch(err => {
        console.error(err)
    })
})