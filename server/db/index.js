const mysql = require("mysql")
const config = require("../configs")

class MariaDB{
    constructor(){
        this.pool = mysql.createPool({
            host: config.mariadb.host, 
            port: config.mariadb.port, 
            user: config.mariadb.user, 
            password: config.mariadb.password, 
            database: config.mariadb.database, 
            connectionLimit: 10
        })
    }

    getConnection(){
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) reject(err)
                else resolve(conn)
            })
        })
    }
}

let db = null

exports.getDB = function(){
    if (db) return db
    db = new MariaDB()
    return db
}