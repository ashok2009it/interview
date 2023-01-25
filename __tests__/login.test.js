import request from "supertest";
import express from "express";
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");

var authRouter = require("../src/routes/api/auth");
const app = new express();

var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(authRouter);

describe("Check Login", function () {
  test("Login", async () => {
    const res = await request(app).post("/api/auth/signin");
    expect(res.statusCode).toBe(200);
    expect(res.success).toBe(true);
  });
});
