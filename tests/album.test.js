
const request = require('supertest');
const app = require('../app');
const { Album } = require('../models');
const { Artist } = require('../models');
const { Song } = require('../models');

const artistMock = {
      name: 'muppets',
      id: 150,
}

const albumMock = {
      name: 'muppeteer',
      id: 300,
      ArtistId: 150,
}

const songMock = {
      title: 'muppeteering',
      youtube_id: 'a1b2c3',
      ArtistId: 150,
      AlbumId: 300,
}


describe('post request new user', () => {

  beforeAll(async done => {
    await Album.destroy({ truncate: true, force: true });
    await Song.destroy({ truncate: true, force: true });
    await Artist.destroy({ truncate: true, force: true });
    done();
  });

  it('Can create song, album and artist', async done => {
    await request(app).post('/api/artists').send(artistMock)
    .expect('Content-Type', /json/);
    await request(app).post('/api/albums').send(albumMock)
    .expect('Content-Type', /json/);
    await request(app).post('/api/songs').send(songMock)
    .expect('Content-Type', /json/);
    done();
  })

    it('can extract songs out of an album', async done => {
    const { body } = await request(app).get(`/api/albums/${albumMock.id}`);
    expect(body.songs[0].title).toBe(songMock.title);
    done();
  })

      it('can extract the artist out of an album', async done => {
    const { body } = await request(app).get(`/api/albums/${albumMock.id}`);
    expect(body.album.Artist.name).toBe(artistMock.name);
    done();
  })

      it('favoriting an album raises its likes count by 1', async done => {
    const { body } = await request(app).get(`/api/albums/${albumMock.id}`);
    await request(app).patch(`/api/albums/like/${albumMock.id}`).send({is_liked: body.album.is_liked + 1})
    .then(result =>expect(result.body.is_liked).toBe(1));
    done();
  })

      it('Can delete album', async done => {
    await request(app).delete(`/api/albums/${albumMock.id}`);
    await request(app).get(`/api/albums/${albumMock.id}`)
    .then(result => expect(result.body.id).toBe(undefined))
    done();
  })


})