const { Router } = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const checkToken = require('../middlewares/checkToken');
require('dotenv').config();

const router = Router();

router.post('/register', async (req, res) => {
const { username } = req.body;
  try {
    let token = jwt.sign(
    {username: username},
    process.env.TOKEN_SECRET,
    { expiresIn: '3d' }
  );
  const newUser = await User.create(req.body);
  await newUser.update({remember_token: token});
  res.json(newUser)
  } catch (err) { res.json(err) }
})


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
  const user = await User.findOne({where : {username: username, password: password}});
    if(!user) {
      return res.status(403).json({
      message: 'Either the username or password you entered is incorrect'
    });
  }
    let token = jwt.sign(
    {username: username},
    process.env.TOKEN_SECRET,
    { expiresIn: '3d' }
  );
  await user.update(req.body);
  await user.update({remember_token: token});
  res.json({
    user: user,
    success: true,
    token,
  });
  } catch (err) { res.json({message: err})}
})

router.patch('/auto', checkToken, async (req, res) => {
  let token = req.token
  try {
  const user = await User.findOne({where : {remember_token: token}});
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

router.delete('/:userId', checkToken, async (req, res) => {
  const userToDelete = await User.findByPk(req.params.userId);
  const userIsAdmin = await User.findByPk(req.username);
if(userIsAdmin.admin) {
  await userToDelete.destroy();
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
})



module.exports = router;