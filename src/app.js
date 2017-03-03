/* eslint no-console: ["off"] */

import Promise       from "bluebird"
import Koa           from "koa"
import koaBodyParser from "koa-bodyparser"
import koaConvert    from "koa-convert"
import koaSession    from "koa-session"
import koaStatic     from "koa-static"
import path          from "path"

import routing from "./app/routing"

const createApp = async () => {
  const app = new Koa()

  /** Load something to app in async **/
  app.myStash = await new Promise(resolve =>
    setTimeout(() => resolve("hogehoge"), 10)
  )

  /** Static File Serving **/
  app.use(koaStatic(path.join(__dirname, "..", "public")))

  /** Session **/
  app.keys = ["hoge-fuga"]
  app.use(koaConvert(koaSession({ key: "test-app" }, app)))

  /** Error Handling **/
  app.use(async (ctx, next) => {
    try {
      await next()
    }
    catch (err) {
      ctx.status = err.status || 500
      ctx.body   = "Something wrong!"
      ctx.app.emit("error", err, ctx)
    }
  })

  /** Response Time Logging **/
  app.use(async (ctx, next) => {
    const req   = ctx.request
    const start = new Date()

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

  return app
}

export default createApp
