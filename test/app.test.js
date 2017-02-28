import expect  from "expect"
import request from "supertest"

import app from "../index"

describe("GET /test.html", () => {
  it("should return static file", done => {
    request(app)
    .get("/test.html")
    .expect(200)
    .expect("Content-Type", /text\/html/)
    .expect(res => expect(res.text).toEqual("<h1>Hello world</h1>\n"))
    .end(done)
  })
})

describe("GET /", () => {
  it("should return a response", done => {
    request(app)
    .get("/")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "GET",
      path:   "/"
    }))
    .end(done)
  })
})

describe("GET /async", () => {
  it("should return a response in a promise", done => {
    request(app)
    .get("/async")
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .expect(res => expect(res.body).toEqual({
      method: "GET",
      path:   "/async"
    }))
    .end(done)
  })
})

describe("GET /error-async", () => {
  it("should return an error response in a promise", done => {
    request(app)
    .get("/error-async")
    .expect(500)
    .expect("Content-Type", /text\/plain/)
    .expect(res => expect(res.text).toEqual("Internal Server Error"))
    .end(done)
  })
})
