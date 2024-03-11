const next = require("next");
const { createServer: createHttpServer } = require("http");
const { createServer: createHttpsServer } = require("https");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const express = require("express");

const dev = true;

const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  cert: fs.readFileSync("./certificates/localhost.crt", "utf-8"),
  key: fs.readFileSync("./certificates/localhost.key", "utf-8"),
};

const serve = () => {
  app.prepare().then(() => {
    const server = express();
    server.use(cookieParser());
    server.get("/api/count", (req, res) => {
      res.status(200).json({
        count: 100,
      });
    });
    server.all("*", (req, res) => {
      handle(req, res);
    });
    if (dev) {
      createHttpsServer(httpsOptions, server).listen(443, () => {
        console.log("> Ready on https://localhost:443");
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
