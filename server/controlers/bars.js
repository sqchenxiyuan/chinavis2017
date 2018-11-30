const { promisify } = require("es6-promisify")
const { getDB } = require("../db/index.js")

async function queryBars(ctx){
    let {
        offset = 0,
        limit = 20
    } = ctx.request.query

    offset = parseInt(offset) || 0
    limit = parseInt(limit) || 0

    let db = getDB()
    let conn
    try {
        conn = await db.getConnection()
        let bars = await promisify(cb => 
            conn.query(
                `SELECT * FROM bars LIMIT ? OFFSET ? `, 
                [limit, offset],
                cb
            )
        )()
        ctx.body = {
            bars: bars
        }
    } catch (err) {
        throw err
    } finally {
        if (conn) {
            conn.release()
        }
    }
}

exports.queryBars = queryBars