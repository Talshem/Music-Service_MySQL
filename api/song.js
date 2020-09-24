const { Router } = require('express');
const { Song } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const allSongs = await Song.findAll();
  res.json(allSongs)
})

router.post('/', async (req, res) => {
  const newSong = await Song.create(req.body);
  res.json(newSong)
})

router.get('/:songId', async (req, res) => {
  const song = await Song.findByPk(req.params.songId);
  res.json(song)
})

router.patch('/count/:songId', async (req, res) => {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
})

router.patch('/like/:songId', async (req, res) => {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
})


router.delete('/:songId', async (req, res) => {
  const song = await Song.findByPk(req.params.songId);
  await song.destroy();
  res.json({ deleted: true })
})

module.exports = router;