const express = require("express");
const router = express.Router();
const User = require("../../db/models").User;
const checkAuth = require("../../middleware/checkAuth");
const Roles = require("../../db/models").Roles;
const Teams = require("../../db/models").Teams;
const { body, validationResult } = require("express-validator");

//Logined User
router.get("/me", checkAuth, async function (req, res) {
  try {
    let user = await User.findOne({
      where: {
        email: req.user.email,
      },
      include: [
        {
          model: Roles,
          as: "roles",
        },
      ],
    });

    res.json({
      success: true,
      msg: "Success",
      user: user,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

router.get("/dashboard", checkAuth, async function (req, res) {
  try {
    let user = await User.findOne({
      where: {
        email: req.user.email,
      },
      include: [
        {
          model: Roles,
          as: "roles",
        },
      ],
    });

    res.json({
      success: true,
      msg: "Success",
      user: user,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

//List of Users
router.get("/list", checkAuth, async function (req, res) {
  try {
    let users = await User.findAll({
      include: [
        {
          model: Roles,
          as: "roles",
        },
        {
          model: Teams,
          as: "teams",
        },
      ],
    });
    res.json({
      success: true,
      msg: "Success",
      data: users,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

//Specific User Details
router.get("/:uuid", checkAuth, async function (req, res) {
  if (!req.params.uuid) {
    return res.status(400).json({
      success: false,
      msg: "Data Validation Failed",
    });
  }
  try {
    let user = await User.findOne({
      where: {
        uuid: req.params.uuid,
      },
      includes: [
        {
          model: Roles,
          as: "roles",
        },
        {
          model: Teams,
          as: "teams",
        },
      ],
    });
    res.json({
      success: true,
      msg: "Success",
      data: user,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

//Add User in the team
router.post(
  "/assign-role",
  [
    body("user_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid user Id"),

    body("role_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid role Id"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Data Validation Failed",
        errors: errors.array(),
      });
    } else {
      try {
        let user = await User.findOne({
          where: {
            id: req.body.user_id,
          },
        });

        await Roles.findOne({
          where: {
            id: req.body.role_id,
          },
        }).then(async (role) => {
          if (user && user) {
            await role.addUsers(user);
          }
        });

        res.json({
          success: true,
          msg: "Success",
        });
      } catch (err) {
        res.status(401).send({
          success: false,
          msg: "Something went wrong" + err,
        });
      }
    }
  }
);

//Delete User
router.delete("/:uuid", checkAuth, async function (req, res) {
  if (!req.params.uuid) {
    return res.status(400).json({
      success: false,
      msg: "Data Validation Failed",
    });
  }
  try {
    await User.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });
    res.json({
      success: true,
      msg: "Success",
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

module.exports = router;
