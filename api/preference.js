const { Router } = require('express');
const { Preference } = require('../models');

require('dotenv').config();

const checkToken = require('../middlewares/checkToken');
const validateChars = require('../middlewares/validateChars');

const router = Router();
var date = new Date();

router.get('/:type/:userId', validateChars, async (req, res) => {
  try {
  const preferences = await Preference.findAll({where: {type: req.params.type, username:req.params.userId }})
  res.json(preferences)
  } catch (err) { res.json(err)}
})

router.post('/', checkToken, async (req, res) => {
  try {
  const newPreference = await Preference.create(req.body);
  res.json(newPreference)
  } catch (err) { res.json(err)}
})

router.patch('/', checkToken, async (req, res) => {
  try {
  const preference = await Preference.findOne({where: req.body});
  await preference.destroy()
  res.json({deleted: true})
  } catch (err) { res.json(err)}
})


module.exports = router;