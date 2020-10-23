const { Router } = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkToken = require('../middlewares/checkToken');
const validateChars = require('../middlewares/validateChars');

const router = Router();
var date = new Date();

router.post('/register', validateChars, async (req, res) => {
const { username } = req.body;
  try {
    let token = jwt.sign(
    {username: username},
    process.env.TOKEN_SECRET,
    { expiresIn: '3d' }
  );
req.body.remember_token = token
req.body.created_at = date.toISOString().substring(0, 10)
req.body.last_login = date.toISOString().substring(0, 10)
  const newUser = await User.create(req.body);
  res.json({
    user: newUser,
    success: true,
    token
  })
  } catch (err) { res.json({message: err}) }
})


router.post('/login', validateChars, async (req, res) => {
  const { username, password } = req.body;
  try {
  const user = await User.findOne({where : {username: username, password: password}});
    if(!user) {
      return res.json({
      message: 'Either the username or password you entered is incorrect'
    });
  }
    let token = jwt.sign(
    {username: username},
    process.env.TOKEN_SECRET,
    { expiresIn: '3d' }
  );
  await user.update(
  {
  last_login: date.toISOString().substring(0, 10),
  remember_token: token
});
  res.json({
    user: user,
    success: true,
    token,
  });
  } catch (err) {res.json({message: err})}
})

router.patch('/auto', checkToken, async (req, res) => {
  let token = req.token
  try {
  const user = await User.findOne({where : {remember_token: token}});
  res.json(user)
  } catch (err) { res.json(err)}
})



router.patch('/:userId', checkToken, async (req, res) => {

  try {
  const user = await User.findByPk(req.params.userId);
  user.update(req.body)
  res.json(req.body)
  } catch (err) { res.json({message: 'user doesn\'t exist'}) }
})

router.get('/', async (req, res) => {
  try {
  const allUsers = await User.scope('filter').findAll();
  res.json(allUsers)
  } catch (err) { res.json(err)}
})

router.get('/:userId', validateChars, async (req, res) => {
  try {
  const user = await User.scope('filter').findByPk(req.params.userId);
  res.json(user)

  } catch (err) { res.json(err)}
})
router.get('/uploads/:userId', validateChars, async (req, res) => {
  try {
  const user = await User.scope('filter').findByPk(req.params.userId);
  const songs = await user.getSongs();
  const albums = await user.getAlbums();
  const artists = await user.getArtists();
  const playlists = await user.getPlaylists();
  let data = {user: user, songs: songs, albums: albums, artists: artists, playlists: playlists}
  res.json(data)
  } catch (err) { res.json({message: err})}
})

router.delete('/:userId', checkToken, async (req, res) => {
  const userToDelete = await User.findByPk(req.params.userId);
  const userIsAdmin = await User.findByPk(req.decoded.username);
if(userIsAdmin.is_admin) {
  await userToDelete.destroy();
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
})



module.exports = router;