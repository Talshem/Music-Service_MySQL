const { Router } = require('express');
const { Playlist } = require('../models');
const { User } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allPlaylists = await Playlist.findAll({where: {name: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['is_liked','DESC']]});
res.json(allPlaylists)
} catch (err) {res.json(err)}
})

router.post('/', async (req, res) => {
try {
  const newPlaylist = await Playlist.create(req.body);
  res.json(newPlaylist)
} catch (err) {res.json(err)}
})

router.get('/:playlistId', async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId, { include: [{model: User, attributes: ['username']}]});
  res.json(playlist)
} catch (err) { res.json(err)}
})

router.patch('/:playlistId', async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
} catch (err) { res.json(err)}
})

router.patch('/like/:playlistId', async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
} catch (err) { res.json(err)}
})

router.delete('/:playlistId', async (req, res) => {
try {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.destroy();
  res.json({ deleted: true })
} catch (err) { res.json(err)}
})

module.exports = router;