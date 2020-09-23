const { Router } = require('express');
const { Album } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const allAlbums = await Album.findAll();
  res.json(allAlbums)
})

router.post('/', async (req, res) => {
  const newAlbum = await Album.create(req.body);
  res.json(newAlbum)
})

router.get('/:albumId', async (req, res) => {
  conalbum = await Album.findByPk(req.params.artistId);
  res.json(album)
})

router.patch('/:albumId', async (req, res) => {
  const album = await Artist.findByPk(req.params.artistId);
  await album.update(req.body);
  res.json(album)
})

router.delete('/:albumId', async (req, res) => {
  const album = await Album.findByPk(req.params.artistId);
  await album.destroy();
  res.json({ deleted: true })
})



module.exports = router;