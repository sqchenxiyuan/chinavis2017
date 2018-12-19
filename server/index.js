const path = require("path")
let Koa = require("koa")

let app = new Koa()

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Methods", "*")
    ctx.set("Access-Control-Allow-Headers", "*")
    await next()
})

let router = require("./routers/index.js")
app.use(require("koa-static")(path.resolve(__dirname, "./public")))
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)