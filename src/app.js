import Promise       from "bluebird"
import Koa           from "koa"
import koaBodyParser from "koa-bodyparser"
import koaRouter     from "koa-router"
import koaStatic     from "koa-static"
import path          from "path"

const router = koaRouter()

router.get("/", async (ctx, next) => {
  const req = ctx.request
  ctx.body = {
    method:  req.method,
    path:    req.path,
    message: "hoge"
  }
})

router.post("/form", async (ctx, next) => {
  const req = ctx.request
  ctx.body = {
    method: req.method,
    path:   req.path,
    query:  req.query
  }
})

router.post("/data.json", async (ctx, next) => {
  const req = ctx.request
  ctx.body = {
    method: req.method,
    path:   req.path,
    json:   req.body
  }
})

router.get("/async", async (ctx, next) =>
  await new Promise(resolve =>
    setTimeout(() => {
      ctx.body = {
        method:  "GET",
        path:    "/async",
        message: "fuga"
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
  const req   = ctx.request
  const start = new Date();

  console.log(`-- Dispatching ${ctx.method} ${ctx.url}`)

  await next()

  const ms = new Date() - start

  console.log(`-- Dispatched  ${req.method} ${req.url} in ${ms} ms`)
})
app.use(koaBodyParser({
  enableType: ["json", "form"],
  detectJSON(ctx) {
    return /\.json$/i.test(ctx.path)
  }
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.on("error", (err, ctx) => {
  console.error(`Got error as ${err}`)
  ctx.response.body = "Something wrong!"
})

export default app
