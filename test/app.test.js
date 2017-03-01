import expect  from "expect"
import request from "supertest"

import app from "../src/app"

describe("GET /test.html", () => {
  it("should return static file", done => {
    request(app.callback())
    .get("/test.html")
    .expect(200)
    .expect("Content-Type", /text\/html/)
    .expect(res => expect(res.text).toEqual("<h1>Hello world</h1>\n"))
    .end(done)
  })
})

describe("GET /", () => {
  it("should return a response", done => {
    request(app.callback())
    .get("/")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method:  "GET",
      path:    "/",
      message: "hoge"
    }))
    .end(done)
  })
})

describe("POST /form", () => {
  it("should return a query as a JSON", done => {
    request(app.callback())
    .post("/form")
    .query({ foo: "bar" })
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "POST",
      path:   "/form",
      query:  { foo: "bar" }
    }))
    .end(done)
  })
})

describe("POST /data.json", () => {
  it("should return accepted JSON in a JSON", done => {
    request(app.callback())
    .post("/data.json")
    .send({ foo: "bar" })
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "POST",
      path:   "/data.json",
      json:   { foo: "bar" }
    }))
    .end(done)
  })
})

describe("GET /async", () => {
  it("should return a response in a promise", done => {
    request(app.callback())
    .get("/async")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method:  "GET",
      path:    "/async",
      message: "fuga"
    }))
    .end(done)
  })
})

describe("GET /error-async", () => {
  it("should return an error response in a promise", done => {
    request(app.callback())
    .get("/error-async")
    .expect(500)
    .expect("Content-Type", /text\/plain/)
    .expect(res => expect(res.text).toEqual("Something wrong!"))
    .end(done)
  })
})
