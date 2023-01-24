const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
require("../../config/passport")(passport);
const { body, validationResult } = require("express-validator");
const randtoken = require("rand-token");
const Roles = require("../../db/models").Roles;
const User = require("../../db/models").User;
const User_Token = require("../../db/models").User_Token;

const curDate = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

//SignUP
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email Address"),
    body("full_name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Invalid full name"),
    body("email").custom((value) => {
      return User.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
    body("password").isLength({ min: 8 }).withMessage("Invalid password"),
    body("roles").not().isEmpty().withMessage("Invalid Roles"),
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
        
        let user = await User.create({
          full_name: req.body.full_name,
          email: req.body.email,
          password: req.body.password,
          active: 1,
          createdAt: curDate,
          updatedAt: curDate,
        });

        var token = jwt.sign(
          {
            ...JSON.parse(JSON.stringify(user)),
            roles: req.body.roles,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 86400 * 30,
          }
        );

        await User_Token.create({
          user_id: user.id,
          token: randtoken.generate(16),
          type: "email",
          createdAt: curDate,
          updatedAt: curDate,
        }).then((user_token) => {
          //
        });

        res.json({
          success: true,
          msg: "Signed up successfully",
          token: token,
        });
      } catch (err) {
        console.log(err);
        res.status(401).send({
          success: false,
          msg: "Something went wrong" + err,
        });
      }
    }
  }
);

//Signin
router.post(
  "/signin",
  [body("email").isEmail().withMessage("Invalid Email Address")],
  [body("password").isString().withMessage("Password is Required")],
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
            email: req.body.email,
          },
          include: [
            {
              model: Roles,
              as: "roles",
            },
          ],
          attributes: { include: ["password"] },
        });
        if (!user) {
          return res.status(401).send({
            success: false,
            msg: "Authentication failed. User not found.",
          });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
          let roles = user.roles.map((role) => role.id);
          if (isMatch && !err) {
            var token = jwt.sign(
              { ...JSON.parse(JSON.stringify(user)), roles },
              process.env.JWT_SECRET,
              {
                expiresIn: 86400 * 30,
              }
            );
            res.json({
              success: true,
              msg: "Logged in successfully",
              token: token,
            });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password.",
            });
          }
        });
      } catch (err) {
        console.log(err);
        res.status(500).send({
          success: false,
          msg: "Something went wrong",
        });
      }
    }
  }
);

module.exports = router;
