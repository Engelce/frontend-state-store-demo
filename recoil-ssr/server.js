const next = require("next");
const { createServer: createHttpServer } = require("http");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const express = require("express");

const dev = true;

const app = next({ dev });
const handle = app.getRequestHandler();

const MOCK_USER_DATA = [
  { id: 1, name: "John Doe", email: "john@example.com", isAdmin: false },
  { id: 2, name: "Jane Doe2", email: "jane@example.com", isAdmin: false },
];

const serve = () => {
  app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());
    server.get("/api/list", (req, res) => {
      res.status(200).json(MOCK_USER_DATA);
    });
    server.all("*", (req, res) => {
      handle(req, res);
    });
    if (dev) {
      createHttpServer(server).listen(3000, () => {
        console.log("> Ready on https://localhost:3000");
      });
    } else {
      createHttpServer(server).listen(8080, () => {
        console.log("> Ready on http://localhost:8080");
      });
    }
  });
};

try {
  serve();
} catch (err) {
  console.info(err);
}
