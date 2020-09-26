
const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

let userLength;

const userMock = {
      username: 'newUser',
      email: 'sss@gmail.com',
      password:'sss'
}

let date = new Date();
const loginMock = {
      password: userMock.password,
      last_login: date.toISOString().substring(0, 10)
}

describe('post request new user', () => {

  beforeAll(async done => {
    await User.destroy({ truncate: true, force: true });
    await request(app).get('/api/users')
    .then((result) => {userLength = result.body.length})
    done();
  });

  it('Can create user', async done => {
    await request(app).post('/api/users').send(userMock)
    .expect('Content-Type', /json/);
    const { body } = await request(app).get('/api/users')
    expect(body.length).toBe(userLength + 1);
    done();
  })

    it('Can login using password and update last_login', async done => {
    await request(app).patch(`/api/users/${userMock.email}`).send(loginMock)
    const { body } = await request(app).get(`/api/users/${userMock.username}`)
    expect(body.last_login.substring(0, 10)).toBe(date.toISOString().substring(0, 10));
    done();
  })

    it('Can not log in with a wrong password', async done => {
    await request(app).patch(`/api/users/${userMock.email}`).send({password: 'ttt'})
    .then(result => expect(result.body.username).toBe(undefined))
    done();
  })

    it('Can not access user\'s password through api', async done => {
    await request(app).get(`/api/users/${userMock.username}`)
    .then(result => expect(result.body.password).toBe(undefined))
    done();
  })

    it('Can delete user', async done => {
    await request(app).delete(`/api/users/${userMock.email}`);
    const { body } = await request(app).get(`/api/users`)
    expect(body.length).toBe(userLength);
    done();
  })

})