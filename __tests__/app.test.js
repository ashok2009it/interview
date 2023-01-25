import request from "supertest";
import express from "express";
var path = require("path");
import indexRouter from "../src/routes/index";

const app = new express();
app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "jade");

app.use(indexRouter);

describe("Check Node Server", function () {
  test("Home Page /", async () => {
    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
    expect(res.statusCode).toBe(200);
  });
});
