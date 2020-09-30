const { Router } = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
  const user = await User.findOne({where : {username: username, password: password}});
    if(!user) {
      return res.status(403).json({
      message: 'Either the username or password you entered is incorrect'
    });
  }
    let token = jwt.sign({username: username},
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  await user.update(req.body);
  res.json({
    user: user,
    success: true,
    token,
  });
  } catch (err) { res.json({message: err})}
})


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
  const allUsers = await User.scope('filter').findAll();
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
  const user = await User.scope('filter').findByPk(req.params.userId);
  res.json(user)
  } catch (err) { res.json(err)}
})
router.get('/uploads/:userId', async (req, res) => {
  try {
  const user = await User.scope('filter').findByPk(req.params.userId);
  const songs = await user.getSongs({scope: ['filter']});
  const albums = await user.getAlbums({scope: ['filter']});
  const artists = await user.getArtists({scope: ['filter']});
  const playlists = await user.getPlaylists({scope: ['filter']});
  let data = {user: user, songs: songs, albums: albums, artists: artists, playlists: playlists}
  res.json(data)
  } catch (err) { res.json(err)}
})

router.delete('/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  await user.destroy();
  res.json({ deleted: true })
})



module.exports = router;