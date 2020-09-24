const { Router } = require('express');
const { Playlist } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
const { name } = req.query;
let allPlaylists;
if (name) {
allPlaylists = await Playlist.findAll({where: {name: {[Op.substring]: name}}, limit: 20});
} else {
allPlaylists = await Playlist.findAll({limit: 20});
}
res.json(allPlaylists)
})

router.post('/', async (req, res) => {
  const newPlaylist = await Playlist.create(req.body);
  res.json(newPlaylist)
})

router.get('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  res.json(playlist)
})

router.patch('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
})

router.patch('/like/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.update(req.body);
  res.json(playlist)
})

router.delete('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.playlistId);
  await playlist.destroy();
  res.json({ deleted: true })
})

module.exports = router;