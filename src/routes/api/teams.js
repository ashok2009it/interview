const express = require("express");
const router = express.Router();
const checkAuth = require("../../middleware/checkAuth");
const Teams = require("../../db/models").Teams;
const User = require("../../db/models").User;
const { body, validationResult } = require("express-validator");

const curDate = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

//List of Teams
router.get("/list", checkAuth, async function (req, res) {
  try {
    let teams = await Teams.findAll({
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    res.json({
      success: true,
      msg: "Success",
      data: teams,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

//Specific Team Details
router.get("/:uuid", checkAuth, async function (req, res) {
  if (!req.params.uuid) {
    return res.status(400).json({
      success: false,
      msg: "Data Validation Failed",
    });
  }
  try {
    let team = await Teams.findOne({
      where: {
        uuid: req.params.uuid,
      },
      include: [
        {
          model: User,
          as: "users",
        },
      ],
    });
    res.json({
      success: true,
      msg: "Success",
      data: team,
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Something went wrong" + err,
    });
  }
});

//Create Team
router.post(
  "/create",
  [
    body("name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Invalid team name"),
    body("name").custom((value) => {
      return Teams.findOne({
        where: {
          name: value,
        },
      }).then((team) => {
        if (team) {
          return Promise.reject("This team name already in use");
        }
      });
    }),
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
        let team = await Teams.create({
          name: req.body.name,
          createdAt: curDate,
          updatedAt: curDate,
        });

        let members = req.body.members;
        if (Array.isArray(members)) {
          members.forEach(async (user) => {
            await team.addUsers(user);
          });
        }
        res.json({
          success: true,
          msg: "Created successfully",
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

//Add User in the team
router.post(
  "/assign-member",
  [
    body("team_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid team Id"),

    body("user_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid User Id"),
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
        let team = await Teams.findOne({
          where: {
            id: req.body.team_id,
          },
        });

        await User.findOne({
          where: {
            id: req.body.user_id,
          },
        }).then(async (user) => {
          if (user && team) {
            await team.addUsers(user);
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

//Make/Remove team Lead to User
router.post(
  "/team-lead",
  [
    body("team_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid team Id"),

    body("user_id")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid User Id"),

    body("is_team_lead")
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage("Invalid is_team_lead"),
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
        let team = await Teams.findOne({
          where: {
            id: req.body.team_id,
          },
        });

        await User.findOne({
          where: {
            id: req.body.user_id,
          },
        }).then(async (user) => {
          if (user && team) {
            await team.addUsers(user, { through: { is_team_lead: 1 } });
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

//Delete Team
router.delete("/:uuid", checkAuth, async function (req, res) {
  if (!req.params.uuid) {
    return res.status(400).json({
      success: false,
      msg: "Data Validation Failed",
    });
  }
  try {
    await Teams.destroy({
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
