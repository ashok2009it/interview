const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/checkAuth');
const { body, validationResult } = require('express-validator');
const Questions = require('../../db/models').Questions;
const Question_Options = require('../../db/models').Question_Options;
const Question_Answers = require('../../db/models').Question_Answers;

const curDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

router.post(
  '/save-answer',
  checkAuth,
  [
    body('question_id')
      .not()
      .isEmpty()
      .trim()
      .isNumeric()
      .escape()
      .withMessage('Invalid Question')
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
        const checkQsn = await Questions.findOne({
          where: {
            id: req.body.question_id,
          },
        });

        if (!checkQsn) {
          return res.status(409).send({
            success: false,
            msg: 'Wrong Question!',
          });
        }

        const checkExistAns = await Question_Answers.findOne({
          where: {
            question_id: req.body.question_id,
            user_id: req.user.id,
          },
        });

        if (checkExistAns) {
          await Question_Answers.update(
            {
              option_id: req.body.option_id,
              option_answer: req.body.option_answer,
              text_answer: req.body.text_answer,
              updatedAt: curDate,
            },
            { where: { id: checkExistAns.id } }
          );
        } else {
          await Question_Answers.create({
            question_id: req.body.question_id,
            user_id: req.user.id,
            option_id: req.body.option_id,
            option_answer: req.body.option_answer,
            text_answer: req.body.text_answer,
            createdAt: curDate,
            updatedAt: curDate,
          });
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

router.post('/save-batch-answer', checkAuth, async (req, res) => {
  try {
    const answers = req.body;

    await answers.forEach(async function (answer, i) {
      let checkQsn = await Questions.findOne({
        where: {
          id: answer.question_id,
        },
      });

      if (checkQsn) {
        let checkExistAns = await Question_Answers.findOne({
          where: {
            question_id: answer.question_id,
            user_id: req.user.id,
          },
        });

        if (checkExistAns) {
          await Question_Answers.update({
            option_id: answer.option_id,
            option_answer: answer.option_answer,
            text_answer: answer.text_answer,
            updatedAt: curDate,
          },
          { where: { id: checkExistAns.id } }
          );
        } else {
          await Question_Answers.create({
            question_id: answer.question_id,
            user_id: req.user.id,
            option_id: answer.option_id,
            option_answer: answer.option_answer,
            text_answer: answer.text_answer,
            createdAt: curDate,
            updatedAt: curDate,
          });
        }
        checkQsn = null;
        checkExistAns = null;
      }
    });

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
});

router.get('/', checkAuth, async (req, res) => {
  try {
    let data = [];

    if (req.query.type) {
      data = await Questions.findAll({
        where: {
          type: req.query.type,
          status: 1,
        },
        include: [
          {
            model: Question_Options,
            attributes: ['id', 'option'],
            as: 'options',
          },
          {
            model: Question_Answers,
            as: 'answers',
            where: { user_id: req.user.id },
          },
        ],
      });
    } else {
      data = await Questions.findAll({
        where: {
          status: 1,
        },
        include: [
          {
            model: Question_Options,
            attributes: ['id', 'option'],
            as: 'options',
          },
        ],
      });
    }
    res.json({
      success: true,
      msg: 'Success',
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({
      success: false,
      msg: 'Something went wrong',
    });
  }
});

module.exports = router;
