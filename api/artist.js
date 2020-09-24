const { Router } = require('express');
const { Artist } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
const { name } = req.query;
let allArtists;
if (name) {
allArtists = await Artist.findAll({where: {name: {[Op.substring]: name}}, limit: 20});
} else {
allArtists = await Artist.findAll({limit: 20});
}
res.json(allArtists)
})

router.post('/', async (req, res) => {
  const newArtist = await Artist.create(req.body);
    console.log(req.body)
  res.json(newArtist)
})

router.get('/:artistId', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  res.json(artist)
})

router.patch('/:artistId', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
})

router.patch('/like/:artistId', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
})

router.delete('/:artistId', async (req, res) => {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.destroy();
  res.json({ deleted: true })
})

module.exports = router;