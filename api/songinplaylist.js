const { Router } = require('express');
const { SongInPlaylist } = require('../models');
const { Song } = require('../models');

require('dotenv').config();

const checkToken = require('../middlewares/checkToken');
const validateChars = require('../middlewares/validateChars');

const router = Router();

router.post('/', checkToken, async (req, res) => {
const songs = JSON.parse(req.body.songs)
console.log(req.body.id)
  try {
  for (let song of songs) {
  await SongInPlaylist.create({
  artist: song.artist,
  SongId: song.value,
  PlaylistId: req.body.id
  });
  }
  res.json({success: true})
  } catch (err) { res.json(err)}
})

router.get('/:playlistId', validateChars, async (req, res) => {
  try {
const songs = await SongInPlaylist.scope('filter').findAll({where: {playlist_id: req.params.playlistId },
include: [{model: Song, attributes: ['youtube_id', 'title', 'length'], 
}]})
  res.json(songs)
  } catch (err) { console.log(err); res.json(err)}
})

module.exports = router;