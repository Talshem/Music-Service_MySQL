const { Router } = require('express');
const { Song } = require('../models');
const { Album } = require('../models');
const { Artist } = require('../models');
const { User } = require('../models');

const validateChars = require('../middlewares/validateChars');
const checkToken = require('../middlewares/checkToken');

const { Op } = require("sequelize");

const router = Router();

router.get('/top', async (req, res) => {
try {
const { name } = req.query;
let allSongs = await Song.scope('filter').findAll({where: {title: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['play_count','DESC']],
include: [{model: Album, attributes: ['name']}, {model: Artist, attributes: ['name']}]})
res.json(allSongs)
} catch (err) {res.json(err)}
})

router.post('/', checkToken, async (req, res) => {
try {
  const newSong = await Song.create(req.body);
  res.json(newSong)
  } catch (err) { res.json(err)}
})

router.get('/:songId', validateChars, async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId, {include: [{model: Album, attributes: ['name', 'cover_img', 'id']}, {model: Artist, attributes: ['name', 'cover_img', 'id']}]});
  res.json(song)
  } catch (err) { res.json(err)}
})

router.patch('/count/:songId', async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
  } catch (err) {res.json(err)}
})

router.patch('/like/:songId', checkToken, async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  await song.update(req.body);
  res.json(song)
  } catch (err) { res.json(err)}
})


router.delete('/:songId', checkToken, async (req, res) => {
try {
  const song = await Song.findByPk(req.params.songId);
  const user = await User.findByPk(req.decoded.username);
  if(user.is_admin || song.username === user.username) {
  await song.destroy()
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
  } catch (err) { res.json(err)}
})

module.exports = router;