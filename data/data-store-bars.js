const mariadb = require("mariadb")
const DB_NAME = "internet_bar"

const pool = mariadb.createPool({host: "127.0.0.1", port: 3306, user: "root", password: "root", database: DB_NAME, connectionLimit: 5})

async function saveBarsData(bars) {
    let conn
    try {
        conn = await pool.getConnection()
        //清除表数据
        await conn.query("TRUNCATE TABLE bars")

        for (let i = 0; i < bars.length; i++){
            let bar = bars[i]
            await conn.query("INSERT INTO bars (id, name, longitude, latitude) VALUES (?, ?, ?, ?)", [bar.id, bar.name, bar.longitude, bar.latitude])
            console.log(`${i}/${bars.length}`)
        }
    } catch (err) {
        throw err
    } finally {
        if (conn) conn.end()
        pool.end()
        console.log("complete")
    }
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

    saveBarsData(bars)
})