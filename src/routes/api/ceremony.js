const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/checkAuth');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const handlebars = require('handlebars');
const Helper = require('../../utils/helper');
const helper = new Helper();
const Ceremonies = require('../../db/models').Ceremonies;
const Ceremony_Members = require('../../db/models').Ceremony_Members;
const User = require('../../db/models').User;
const dateTime = require('date-and-time');

const curDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

handlebars.registerHelper('link', function (text, url) {
  var url = handlebars.escapeExpression(url),
    text = handlebars.escapeExpression(text);
  return new handlebars.SafeString("<a href='" + url + "'>" + text + '</a>');
});

/* 
    Submit ceremony, partner and officient details 
*/
router.post(
  '/onboarding',
  checkAuth,
  [
    body('date')
      .not()
      .isEmpty()
      .trim()
      .isDate()
      .escape()
      .withMessage('Invalid date'),
    body('created_by')
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage('Invalid created by'),

    body('wedding_place')
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage('Wedding Place is Required!'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: 'Data Validation Failed',
        errors: errors.array(),
      });
    } else {
      try {
        const checkEntry = await Ceremonies.findOne({
          where: {
            date: req.body.date,
            created_by: req.user.id,
          },
        });

        if (checkEntry) {
          return res.status(409).send({
            success: false,
            msg: 'This record already exist!',
          });
        }

        let ceremony = await Ceremonies.create({
          date: req.body.date,
          created_by: req.user.id,
          wedding_place: req.body.wedding_place,
          state: req.body.state,
          city: req.body.city,
          venue: req.body.venue,
          is_legal_valid: req.body.is_legal_valid,
          how_long_ceremony: req.body.how_long_ceremony,
          createdAt: curDate,
          updatedAt: curDate,
        });

        if (ceremony) {
          /* Role 1: Couple, 2: officiant, 3: family */

          const members = req.body.members;
          let base64Cid = Buffer.from('' + ceremony.id).toString('base64');

          await members.forEach(async function (member, i) {
            if (member.legal_name && member.email) {
              await Ceremony_Members.create({
                ceremony_id: ceremony.id,
                created_by: req.user.id,
                legal_name: member.legal_name,
                preferred_name: member.preferred_name,
                email: member.email,
                phone: member.phone,
                relation_with_couple: member.relation_with_couple,
                officiated_before: member.officiated_before,
                officiated_times: member.officiated_times,
                is_license_hold: member.is_license_hold,
                member_type: member.member_type,
                createdAt: curDate,
                updatedAt: curDate,
              });
            }
          });

          await User.update(
            {
              onboarding_completed: true,
            },
            { where: { id: req.user.id } }
          );

          let officiateMembers = [];
          let coupleMembers = [];
          if (req.user.roles.length > 0) {
            /* Filling details from couple */
            if (req.user.roles[0] === 1) {
              officiateMembers = members.filter(
                (m) => m.member_type === 'officiant'
              );
              coupleMembers = members.filter((m) => m.member_type === 'couple');
            }
          }
        }
        res.json({
          success: true,
          msg: 'Success',
        });
      } catch (err) {
        console.log(err);
        res.status(401).send({
          success: false,
          msg: 'Something went wrong',
        });
      }
    }
  }
);

router.get('/:id', checkAuth, async (req, res) => {
  try {
    let ceremony = null;

    if (req.params.id > 0) {
      const isValidCeremony = await Ceremonies.findOne({
        attributes: ['id'],
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: Ceremony_Members,
            attributes: ['id'],
            as: 'members',
            where: { email: req.user.email },
          },
        ],
      });

      if (isValidCeremony) {
        ceremony = await Ceremonies.findOne({
          where: {
            id: req.params.id,
          },
          include: [
            {
              model: Ceremony_Members,
              as: 'members',
            },
          ],
        });
      }
    }
    if (ceremony) {
      res.json({
        success: true,
        msg: 'Success',
        data: ceremony,
      });
    } else {
      res.json({
        success: false,
        msg: 'Invalid Ceremony or User is not part of the ceremony!',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
});

module.exports = router;
