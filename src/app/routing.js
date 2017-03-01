import Promise   from "bluebird"
import koaRouter from "koa-router"

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

router.get("/my-stash", async (ctx, next) => {
  ctx.body = {
    stash: ctx.app.myStash
  }
})

export default router
