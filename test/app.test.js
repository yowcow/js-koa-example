/* eslint-env node, mocha */

import expect  from "expect"
import request from "supertest"

import app from "../src/app"

describe("GET /test.html", () => {
  it("should return static file", () =>
    request(app.callback())
    .get("/test.html")
    .expect(200)
    .expect("Content-Type", /text\/html/)
    .expect(res => expect(res.text).toEqual("<h1>Hello world</h1>\n"))
  )
})

describe("GET /", () => {
  it("should return a response", () =>
    request(app.callback())
    .get("/")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method:  "GET",
      path:    "/",
      message: "hoge"
    }))
  )
})

describe("POST /form", () => {
  it("should return a query as a JSON", () =>
    request(app.callback())
    .post("/form")
    .query({ foo: "bar" })
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "POST",
      path:   "/form",
      query:  { foo: "bar" }
    }))
  )
})

describe("POST /data.json", () => {
  it("should return accepted JSON in a JSON", () =>
    request(app.callback())
    .post("/data.json")
    .send({ foo: "bar" })
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "POST",
      path:   "/data.json",
      json:   { foo: "bar" }
    }))
  )
})

describe("GET /async", () => {
  it("should return a response in a promise", () =>
    request(app.callback())
    .get("/async")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method:  "GET",
      path:    "/async",
      message: "fuga"
    }))
  )
})

describe("GET /error-async", () => {
  it("should return an error response in a promise", () =>
    request(app.callback())
    .get("/error-async")
    .expect(500)
    .expect("Content-Type", /text\/plain/)
    .expect(res => expect(res.text).toEqual("Something wrong!"))
  )
})

describe("GET /my-stash", () => {
  it("should return app.myStash", () =>
    request(app.callback())
    .get("/my-stash")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      stash: "hogehoge"
    }))
  )
})

describe("GET /count-up", () => {
  let cookies

  it("should return count 1", () =>
    request(app.callback())
    .get("/count-up")
    .expect(200)
    .expect(res => expect(res.body).toEqual({ count: 1 }))
    .expect(res => {
      cookies = res.headers["set-cookie"]
        .map(cookie => cookie.split(";")[0])
        .join(";")
    })
  )

  it("should return count 2", () => {
    const req = request(app.callback())
    .get("/count-up")

    req.cookies = cookies // Set cookie header

    return req.send()
    .expect(200)
    .expect(res => expect(res.body).toEqual({ count: 2 }))
  })
})
