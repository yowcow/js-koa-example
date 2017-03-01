import Koa           from "koa"
import koaBodyParser from "koa-bodyparser"
import koaStatic     from "koa-static"
import path          from "path"

import routing from "./app/routing"

const app = new Koa()

/** Static File Serving **/
app.use(koaStatic(path.join(__dirname, "..", "public")))

/** Error Handling **/
app.use(async (ctx, next) => {
  try {
    await next()
  }
  catch (err) {
    ctx.status = err.status || 500
    ctx.body   = "Something wrong!"
    ctx.app.emit('error', err, ctx)
  }
})

/** Response Time Logging **/
app.use(async (ctx, next) => {
  const req   = ctx.request
  const start = new Date();

  console.log(`-- Dispatching ${ctx.method} ${ctx.url}`)

  await next()

  const ms = new Date() - start

  console.log(`-- Dispatched  ${req.method} ${req.url} in ${ms} ms`)
})

/** Request Parsing  **/
app.use(koaBodyParser({
  enableType: ["json", "form"],
  detectJSON(ctx) {
    return /\.json$/i.test(ctx.path)
  }
}))

/** Routing **/
app.use(routing.routes())
app.use(routing.allowedMethods())

export default app
