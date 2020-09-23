const { Router } = require('express');
const { Playlist } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const allPlaylists = await Playlist.findAll();
  res.json(allPlaylists)
})

router.post('/', async (req, res) => {
  const newPlaylist = await Playlist.create(req.body);
  res.json(newPlaylist)
})

router.get('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.artistId);
  res.json(playlist)
})

router.patch('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.artistId);
  await playlist.update(req.body);
  res.json(playlist)
})

router.delete('/:playlistId', async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.artistId);
  await playlist.destroy();
  res.json({ deleted: true })
})

module.exports = router;