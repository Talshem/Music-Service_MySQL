const { Router } = require('express');
const { User } = require('../models');

const router = Router();

const { Op } = require("sequelize");

router.get('/auto/:code', async (req, res) => {
  try {
  const user = await User.findOne({where : {auto_code: req.params.code}});
  res.json(user)
  } catch (err) { res.json(err)}
})

router.get('/preferences/:userId', async (req, res) => {
  try {
  const user = await User.findByPk(req.params.userId);
  res.json(user.preferences)
  } catch (err) { res.json(err)}
})

router.get('/', async (req, res) => {
  try {
  const allUsers = await User.findAll();
  res.json(allUsers)
  } catch (err) { res.json(err)}
})

router.post('/', async (req, res) => {
  try {
  const newUser = await User.create(req.body);
  res.json(newUser)
  } catch (err) { res.json(err) }
})

router.get('/:userId', async (req, res) => {
  try {
  const user = await User.findOne({where : { [Op.or]: [{ username: req.params.userId }, { email: req.params.userId }]}});
  res.json(user)
  } catch (err) { res.json(err)}
})

router.patch('/:userId', async (req, res) => {
  try {
  const user = await User.findOne({where : {email: req.params.userId, password: req.body.password}});
  await user.update(req.body);
  res.json(user)
  } catch (err) { res.json(err)}
})

/*
router.delete('/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  await user.destroy();
  res.json({ deleted: true })
})
*/


module.exports = router;