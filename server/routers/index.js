let Router = require("koa-router")
let router = new Router()

const barsControlers = require("../controlers/bars.js")

router.get("/", (ctx, next) => {
    ctx.body = "hello world"
})

router.get("/bars", barsControlers.queryBars)

module.exports = router