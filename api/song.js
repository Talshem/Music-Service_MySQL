const { Router } = require('express');
const { Song } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allSongs = await Song.scope('filter').findAll(
{where: {title: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['play_count','DESC']]}
)
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