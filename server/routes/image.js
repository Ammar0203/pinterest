const express = require("express");
const Image = require("../models/image");

const router = express.Router();

router.post("/", async function (req, res) {
  const images = await Image.find()
  return res.status(200).json(images)
});

function authenticated(req, res, next) {
  if (!req.user) return res.status(401).send("Not authenticated");
  return res.status(401).send("Not authenticated");
}
function notAuthenticated(req, res, next) {
  if (req.user) return res.status(403).send("Already authenticated");
  return next();
}

module.exports = router;
