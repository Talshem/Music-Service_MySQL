const { Router } = require('express');
const { Album } = require('../models');
const { Artist } = require('../models');
const checkToken = require('../middlewares/checkToken');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allAlbums = await Album.scope('filter').findAll({where: {name: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['is_liked','DESC']],
include: [{model: Artist, attributes: ['name']}]})
res.json(allAlbums)
} catch (err) { res.json(err)}
})

router.post('/', checkToken, async (req, res) => {
  try {
  const newAlbum = await Album.create(req.body);
  res.json(newAlbum)
  } catch (err) { res.json(err) }
})

router.get('/:albumId', async (req, res) => {
  try {
  const album = await Album.scope('filter').findByPk(req.params.albumId, {include: [{model: Artist, attributes: ['name']}]});
  const songs = await album.getSongs();
  let data = {album: album, songs: songs}
  res.json(data)
  } catch (err) { res.json(err)}
})

router.patch('/:albumId', checkToken, async (req, res) => {
  try {
  const album = await Artist.findByPk(req.params.albumId);
  await album.update(req.body);
  res.json(album)
  } catch (err) { res.json(err)}
})

router.patch('/like/:albumId', checkToken, async (req, res) => {
  try {
  const album = await Album.findByPk(req.params.albumId);
  await album.update(req.body);
  res.json(album)
} catch (err) { res.json(err)}
})

router.delete('/:albumId', checkToken, async (req, res) => {
  try {
  const album = await Album.findByPk(req.params.albumId);
  const user = await User.findByPk(req.username);
  if(user.admin || album.username === user.username) {
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
  res.json({ deleted: true })
  } catch (err) {res.json(err)}
})



module.exports = router;