const { Router } = require('express');
const { Artist } = require('../models');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allArtists;
if (name) {
allArtists = await Artist.findAll({where: {name: {[Op.substring]: name}}, limit: 20});
} else {
allArtists = await Artist.findAll({limit: 20});
}
res.json(allArtists)
} catch (err) { res.json(err)}
})

router.post('/', async (req, res) => {
try {
  const newArtist = await Artist.create(req.body);
  res.json(newArtist)
  } catch (err) { res.json(err)}
})

router.get('/:artistId', async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  res.json(artist)
  } catch (err) { res.json(err)}
})

router.patch('/:artistId', async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
  } catch (err) { res.json(err)}
})

router.patch('/like/:artistId', async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
  } catch (err) { res.json(err)}
})

router.delete('/:artistId', async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.destroy();
  res.json({ deleted: true })
  } catch (err) { res.json(err)}
})

module.exports = router;