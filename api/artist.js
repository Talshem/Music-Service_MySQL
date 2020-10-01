const { Router } = require('express');
const { Artist } = require('../models');
const checkToken = require('../middlewares/checkToken');

const { Op } = require("sequelize");

const router = Router();

router.get('/', async (req, res) => {
try {
const { name } = req.query;
let allArtists = await Artist.findAll({where: {name: {[Op.substring]: name ? name : ''}}, limit: 20, order: [['is_liked','DESC']]});
res.json(allArtists)
} catch (err) { res.json(err)}
})

router.post('/', checkToken, async (req, res) => {
try {
  const newArtist = await Artist.create(req.body);
  res.json(newArtist)
  } catch (err) { res.json(err)}
})

router.get('/:artistId', async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  const albums = await artist.getAlbums();
  const songs = await artist.getSongs();
let data = {artist: artist, songs: songs, albums: albums}
  res.json(data)
  } catch (err) { res.json(err)}
})

router.patch('/:artistId',checkToken, async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
  } catch (err) { res.json(err)}
})

router.patch('/like/:artistId',checkToken, async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  await artist.update(req.body);
  res.json(artist)
  } catch (err) { res.json(err)}
})

router.delete('/:artistId',checkToken, async (req, res) => {
try {
  const artist = await Artist.findByPk(req.params.artistId);
  if(req.admin || artist.username === req.username) {
  res.json({ deleted: true })
} else {
res.send('You are not authorized to do this action.')
}
  } catch (err) { res.json(err)}
})

module.exports = router;