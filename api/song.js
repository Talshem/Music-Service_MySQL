const { Router } = require('express');
const { Song } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
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
} catch (err) { res.json(err)}
})

router.post('/', async (req, res) => {
try {
  const newSong = await Song.create(req.body);
  res.json(newSong)
  } catch (err) { res.json(err)}
})

router.get('/:songId', async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  res.json(song)
  } catch (err) { res.json(err)}
})

router.patch('/count/:songId', async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
  } catch (err) { res.json(err)}
})

router.patch('/like/:songId', async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
  } catch (err) { res.json(err)}
})


router.delete('/:songId', async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  await song.destroy();
  res.json({ deleted: true })
  } catch (err) { res.json(err)}
})

module.exports = router;