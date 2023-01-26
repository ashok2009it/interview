const express = require("express");
const router = express.Router();
const User = require("../../db/models").User;
const checkAuth = require("../../middleware/checkAuth");
const Roles = require("../../db/models").Roles;

//List of roles
router.get("/", checkAuth, async function (req, res) {
  try {
    let roles = await Roles.findAll();
    res.json({
      success: true,
      msg: "Success",
      data: roles,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

module.exports = router;
