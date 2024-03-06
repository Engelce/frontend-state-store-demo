const next = require("next");
const { createServer: createHttpServer } = require("http");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const express = require("express");

const app = next({ dev: true });
const handle = app.getRequestHandler();

const MOCK_TODO_DATA = [{ description: "Coding~~~" }, { description: "Studying~~~~" }];

const serve = () => {
  app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());
    server.get("/api/list", (req, res) => {
      res.status(200).json(MOCK_TODO_DATA);
    });
    server.all("*", (req, res) => {
      handle(req, res);
    });
    createHttpServer(server).listen(3000, () => {
      console.log("> Ready on https://localhost:3000");
    });
  });
};

try {
  serve();
} catch (err) {
  console.info(err);
}
