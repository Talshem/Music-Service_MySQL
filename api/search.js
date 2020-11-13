const { Song, Album, Artist, Playlist } = require('../models');
const { Router } = require('express');
require('dotenv').config()
const router = Router();
const { Op } = require("sequelize");

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ 
    cloud: {
        id: process.env.elastic_ID
    },
    auth: {
      username: 'elastic',
      password: process.env.elastic_PASSWORD
    }
})


const fetchElasticData = async (index, data) => {
await client.indices.create({
    index:  index,
});
const body = data.flatMap(doc => [{ index: {_index: index}}, doc]);
const { body: bulk } = await client.bulk({ refresh: true, body });
if (bulk.errors) console.log(bulk.error)
else {
const { body: count } = await client.count({ index: index })
console.log(count)
}}


router.post('/', async (req, res) => {
try {
const { songs, albums, artists, playlists } = req.body
await fetchElasticData('songs', songs);
await fetchElasticData('albums', albums);
await fetchElasticData('artists', artists);
await fetchElasticData('playlists', playlists);
} catch (error) {
    res.send(error)
}
})

router.get('/', async (req, res) => {
try {
let allSongs = await Song.scope('filter').findAll({
            order: [['play_count','DESC']],
            include:[
            {
            model: Album, attributes: ['name']
            },
            {
            model: Artist, attributes: ['name']
            }
        ]
    })

let allAlbums = await Album.scope('filter').findAll({
        order: [['is_liked','DESC']],
        include: [{
            model: Artist,
            attributes: ['name']
        }]
    })

let allArtists = await Artist.findAll({
        order: [['is_liked','DESC']]
    });

let allPlaylists = await Playlist.findAll({
            order: [['is_liked','DESC']]
        });
        
res.send({
songs: allSongs,
albums: allAlbums,
artists: allArtists,
playlists: allPlaylists    
})

} catch (err) {
res.json(err)
}
})

router.get('/songs', async (req, res) => {
const { name } = req.query;
try {
const { body } = await client.search({
    index: 'songs',
    body: {
        query: {
                query_string: {
                query: `*${name}*`,
                fields: ['title']
            }
        }
    }
})
res.send(body.hits.hits.map(e => e = e._source))
} catch (err) { console.log(err); res.send(err) }
})

router.get('/albums', async (req, res) => {
const { name } = req.query;

const { body } = await client.search({
    index: 'albums'
    // body: {
    //     query: {
    //         match: {
    //             title: name
    //         }
    //     }
    // }
})
res.send(body.hits.hits.map(e => e = e._source))
})

router.get('/artists', async (req, res) => {
const { name } = req.query;

const { body } = await client.search({
    index: 'artists'
    // body: {
    //     query: {
    //         match: {
    //             title: name
    //         }
    //     }
    // }
})
res.send(body.hits.hits.map(e => e = e._source))
})

router.get('/playlists', async (req, res) => {
const { name } = req.query;

const { body } = await client.search({
    index: 'playlists'
    // body: {
    //     query: {
    //         match: {
    //             title: name
    //         }
    //     }
    // }
})
res.send(body.hits.hits.map(e => e = e._source))
})


module.exports = router;