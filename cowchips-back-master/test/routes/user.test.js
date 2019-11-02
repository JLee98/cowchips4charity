import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';

import server from '../../src/server';
import UserHelper from './helpers/user.helpers';
import SharedHelper from './helpers/shared.helpers';
import { statusCode } from '../../src/response';
import { authTokenName } from '../../src/config';

const assert = chai.assert;
const chance = new Chance();

chai.use(chaiHttp);

const numUsers = chance.integer({ min: 30, max: 100 });
let users;
beforeAll(() => UserHelper.setupUsers(numUsers)
  .then((u) => users = u));
afterAll(() => SharedHelper.cleanup({ users })
  .then(() => mongoose.disconnect()));

describe('Users', () => {

  describe('/POST register', () => {

    const user = UserHelper.generateUser();
    const invalidUser = UserHelper.generateInvalidUser();

    afterAll(() => SharedHelper.cleanup({ users: [user, invalidUser] }));

    it('it should register a new user', () =>
      chai.request(server)
        .post('/register')
        .send(user)
        .then((res) => UserHelper.registerSuccessful(res))
        // make sure they can login after
        .then(() => UserHelper.userLogin(user))
        .then((res) => SharedHelper.loginSuccessful(res))
        // next to try to make another user with the same email (should fail)
        .then(() =>
          chai.request(server)
            .post('/register')
            .send(UserHelper.generateUser({ email: user.email }))
            .then((res) => UserHelper.userAlreadyExists(res))));

    it('it should not allow a user to be created with malformed data', () =>
      chai.request(server)
        .post('/register')
        .send(invalidUser)
        .then((res) => SharedHelper.badRequest(res)));
  });

  describe('/POST login', () => {

    let user;
    beforeAll(() => user = chance.pickone(users));

    it('it should login a registered user', () =>
      UserHelper.userLogin(user)
        .then((res) => SharedHelper.loginSuccessful(res)));

    it('it should not allow a login with wrong password', () => {
      const creds = {
        email: user.email,
        password: user.password + 'extra',
      };
      return UserHelper.userLogin(creds)
        .then((res) => SharedHelper.loginFailed(res));
    });

    it('it should not allow an unregistered user to login', () => {
      return UserHelper.userLogin(UserHelper.generateUser())
        .then((res) => SharedHelper.loginFailed(res));
    });
  });

  // TODO ADD TEST FOR NO COOKIE PRESENT?
  describe('/GET account', () => {

    let user;
    beforeAll(() => user = chance.pickone(users));

    it('it should use a cookie from login to get user information', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .get('/account')
            .set('Authorization', loginRes.body.token)
            .then((res) => {
              assert.equal(res.status, statusCode.OK, 'status is 200');
              assert.typeOf(res.body, 'object', 'res is an object');

              UserHelper.isUser(res.body);
              UserHelper.usersEqual(res.body, user);
            })));

    it('it should not allow a bad token to be granted access', () =>
      chai.request(server)
        .get('/account')
        .set('Authorization', 'faketoken')
        .then((res) => {
          assert.equal(res.status, statusCode.UNAUTHORIZED, 'status is 401');
          assert.typeOf(res.body, 'object', 'res is an object');
          assert.property(res.body, 'auth');
          assert.property(res.body, 'error');
          assert.equal(res.body.auth, false, 'auth is false');
          assert.equal(res.body.error, 'you do not have the proper permissions to perform that action');
        }));

    it('it should not allow access to a browser without a token', () =>
      chai.request(server)
        .get('/account')
        .then((res) => {
          assert.equal(res.status, statusCode.UNAUTHORIZED);
          assert.typeOf(res.body, 'object');
          assert.property(res.body, 'auth');
          assert.property(res.body, 'error');
          assert.equal(res.body.auth, false);
          assert.equal(res.body.error, 'you do not have the proper permissions to perform that action');
        }));
  });

  describe('/PUT account', () => {

    let user = UserHelper.generateUser();
    beforeEach(() => SharedHelper.setup({ users: [user] }));
    afterEach(() => SharedHelper.cleanup({ users: [user] }));

    it('it should allow for a user with a valid token to update his/her information', () =>
      UserHelper.userLogin(user)
        .then((loginRes) => {
          user = UserHelper.generateUser({ email: user.email, dob: user.dob });
          const updateInfo = SharedHelper.copy(user);
          delete updateInfo.email;
          delete updateInfo.dob;

          return chai.request(server)
            .put('/account')
            .set('Authorization', loginRes.body.token)
            .send(updateInfo)
            .then((res) => {
              assert.equal(res.status, statusCode.OK, 'status is 200');
              assert.typeOf(res.body, 'object', 'res is an object');

              UserHelper.isUser(res.body);
              UserHelper.usersEqual(res.body, user);
            })
            .then(() => UserHelper.userLogin(user))
            .then((res) => SharedHelper.loginSuccessful(res));
        }));

    it('it should not allow an unauthenticated user to update information', () => {
      const updateInfo = UserHelper.generateUser({ email: user.email, dob: user.dob });
      delete updateInfo.email;
      delete updateInfo.dob;

      return chai.request(server)
        .put('/account')
        .set('Authorization', 'faketoken')
        .send(updateInfo)
        .then((res) => {
          assert.equal(res.status, statusCode.UNAUTHORIZED, 'status is 400');
          assert.typeOf(res.body, 'object', 'res is an object');
          assert.property(res.body, 'auth');
          assert.property(res.body, 'error');
          assert.equal(res.body.auth, false, 'auth is false');
          assert.equal(res.body.error, 'you do not have the proper permissions to perform that action');
        });
    });

    it('it should not allow a user to update their information with malformed data', () => {
      const invalidUpdate = UserHelper.generateInvalidUser({ email: user.email });
      delete invalidUpdate.email;

      return UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .put('/account')
            .set('Authorization', loginRes.body.token)
            .send(invalidUpdate)
            .then((res) => SharedHelper.badRequest(res)))
        .then(() => UserHelper.userLogin(user))
        .then((res) => SharedHelper.loginSuccessful(res));
    });

    // TODO add test for update just password, just name, or just phone
  });
});
