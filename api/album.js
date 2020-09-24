const { Router } = require('express');
const { Album } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { artist } = req.query;
const { name } = req.query;
let allAlbums;
if (artist){
allAlbums = await Album.findAll({where: {artist: artist}, limit: 20});
} else if (name) {
allAlbums = await Album.findAll({where: {name: {[Op.substring]: name}}, limit: 20});
} else {
allAlbums = await Album.findAll({limit: 20});
}
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
  const album = await Album.findByPk(req.params.albumId);
  res.json(album)
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