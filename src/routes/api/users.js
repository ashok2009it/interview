const express = require('express');
const router = express.Router();
const User = require('../../db/models').User;
const passport = require('passport');
const checkAuth = require('../../middleware/checkAuth');
require('../../config/passport')(passport);
const Helper = require('../../utils/helper');
const helper = new Helper();
const Roles = require('../../db/models').Roles;
const Ceremonies = require('../../db/models').Ceremonies;
const Ceremony_Members = require('../../db/models').Ceremony_Members;

//Logined User
router.get('/me', checkAuth, async function (req, res) {
  let user = await User.findOne({
    where: {
      email: req.user.email,
    },
    include: [
      {
        model: Roles,
        as: 'roles',
      },
    ],
  });

  res.json({
    success: true,
    msg: 'Success',
    user: user,
  });
});

router.get('/dashboard', checkAuth, async function (req, res) {
  let user = await User.findOne({
    where: {
      email: req.user.email,
    },
    include: [
      {
        model: Roles,
        as: 'roles',
      },
      {
        model: Ceremonies,
        as: 'ceremonies',
        include: [{
          model:Ceremony_Members,
          as: 'members'
        }] 
      },
      
    ],
  });

  res.json({
    success: true,
    msg: 'Success',
    user: user,
  });
});

module.exports = router;
