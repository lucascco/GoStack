const { Router } = require("express");

const routes = new Router();

routes.get("/", (req, res) => {
  console.log("Hello word!");
});

module.exports = routes;
