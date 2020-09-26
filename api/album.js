const { Router } = require('express');
const { Album } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allAlbums = await Album.scope('filter').findAll({where: {name: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['is_liked','DESC']]});
res.json(allAlbums)
} catch (err) { res.json(err)}
})

router.post('/', async (req, res) => {
  try {
  const newAlbum = await Album.create(req.body);
  res.json(newAlbum)
  } catch (err) { res.json(err) }
})

router.get('/:albumId', async (req, res) => {
  try {
  const album = await Album.scope('filter').findByPk(req.params.albumId);
  const songs = await album.getSongs();
  let data = {album: album, songs: songs}
  res.json(data)
  } catch (err) { res.json(err)}
})

router.patch('/:albumId', async (req, res) => {
  try {
  const album = await Artist.findByPk(req.params.albumId);
  await album.update(req.body);
  res.json(album)
  } catch (err) { res.json(err)}
})

router.patch('/like/:albumId', async (req, res) => {
  try {
  const album = await Album.findByPk(req.params.albumId);
  await album.update(req.body);
  res.json(album)
} catch (err) { res.json(err)}
})

router.delete('/:albumId', async (req, res) => {
  try {
  const album = await Album.findByPk(req.params.albumId);
  await album.destroy();
  res.json({ deleted: true })
  } catch (err) { res.json(err)}
})



module.exports = router;