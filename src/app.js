import Promise   from "bluebird"
import Koa       from "koa"
import koaRouter from "koa-router"
import koaStatic from "koa-static"
import path      from "path"

const router = koaRouter()

router.get("/", async (ctx, next) => {
  ctx.body = {
    method: "GET",
    path:   "/"
  }
})

router.get("/async", async (ctx, next) =>
  await new Promise(resolve =>
    setTimeout(() => {
      ctx.body = {
        method: "GET",
        path:   "/async"
      }
      resolve()
    }, 50)
  )
)

router.get("/error-async", async (ctx, next) =>
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(new Error("Hoge Fuga"))
    }, 50)
  )
)

const app = new Koa()

app.use(koaStatic(path.join(__dirname, "..", "public")))
app.use(async (ctx, next) => {
  console.log(`-- Dispatching ${ctx.method} ${ctx.url}`)

  const start = new Date();

  await next()

  const ms = new Date() - start

  console.log(`-- Dispatched  ${ctx.method} ${ctx.url} in ${ms} ms`)
})
app.use(router.routes())
app.use(router.allowedMethods())

app.on("error", (err, ctx) => {
  console.error(`Got error as ${err}`)
  ctx.body = "Something wrong!"
})

export default app
