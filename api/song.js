const { Router } = require('express');
const { Song } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
const { name } = req.query;
const { album } = req.query;
const { artist } = req.query;
let allSongs;
if (album){
allSongs = await Song.findAll({where: {album: album}, limit: 20});
}
else if (artist){
allSongs = await Song.findAll({where: {artist: artist}, limit: 20});
}
else if (name) {
allSongs = await Song.findAll({where: {title: {[Op.substring]: name}}, limit: 20});
} else {
allSongs = await Song.findAll({limit: 20});
}
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