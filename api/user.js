const { Router } = require('express');
const { User } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const allUsers = await User.findAll();
  res.json(allUsers)
})

router.post('/', async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser)
})

router.get('/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  res.json(user)
})

router.patch('/:userId', async (req, res) => {
  const user = await AUser.findByPk(req.params.userId);
  await user.update(req.body);
  res.json(user)
})

router.delete('/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  await user.destroy();
  res.json({ deleted: true })
})



module.exports = router;