const { Router } = require('express');
const { Playlist, User } = require('../models');

const validateChars = require('../middlewares/validateChars');
const checkToken = require('../middlewares/checkToken');

const { Op } = require("sequelize");

const router = Router();

router.get('/top', async (req, res) => {
try {
const { name } = req.query;
let allPlaylists = await Playlist.findAll({where: {name: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['is_liked','DESC']]});
res.json(allPlaylists)
} catch (err) {res.json(err)}
})

router.post('/', checkToken, async (req, res) => {
try {
  const newPlaylist = await Playlist.create(req.body);
  res.json(newPlaylist)
} catch (err) {res.json(err)}
})

router.get('/:playlistId', validateChars, async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  res.json(playlist)
} catch (err) {res.json(err)}
})

router.patch('/:playlistId', checkToken, async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
} catch (err) { res.json(err)}
})

router.patch('/like/:playlistId', checkToken, async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
} catch (err) { res.json(err)}
})

router.delete('/:playlistId', checkToken, async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  const user = await User.findByPk(req.decoded.username);
  if(user.is_admin || playlist.username === user.username) {
  await playlist.destroy();
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
} catch (err) { res.json(err)}
})

module.exports = router;