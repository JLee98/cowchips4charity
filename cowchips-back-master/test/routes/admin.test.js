import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';

import { statusCode } from '../../src/response';
import server from '../../src/server';

import SharedHelper from './helpers/shared.helpers';
import AdminHelper from './helpers/admin.helpers';
import UserHelper from './helpers/user.helpers';
import OrganizationHelper from './helpers/organization.helpers';
import GameHelper from './helpers/game.helpers';
import DonationHelper from './helpers/donation.helpers';

import security from '../../src/security/security';
import Generator from './helpers/generator';

import { numPagesHeaderName, authTokenName } from '../../src/config';

const assert = chai.assert;

const chance = new Chance();

chai.use(chaiHttp);

const numOrgsBounds = { min: 10, max: 20 };
const numFinishedGamesBounds = { min: 5, max: 10 };
const numActiveGamesBounds = { min: 4, max: 6 };
const numUpcomingGamesBounds = { min: 20, max: 30 };
const numUsersBounds = { min: 30, max: 40 };
const numDonationsBounds = { min: 50, max: 70 };

const numOrgs = chance.integer(numOrgsBounds);
const numFinished = chance.integer(numFinishedGamesBounds);
const numActive = chance.integer(numActiveGamesBounds);
const numUpcoming = chance.integer(numUpcomingGamesBounds);
const numUsers = chance.integer(numUsersBounds);
const numDonations = chance.integer(numDonationsBounds);

let organizations = [];
let games = [];
let active = [];
let finished = [];
let upcoming = [];
let users = [];
let donations = [];

beforeAll(() =>
  UserHelper.setupUsers(numUsers)
    .then((createdUsers) => users = createdUsers)
    .then(() => OrganizationHelper.setupOrganizations()
      .then((orgs) => organizations = orgs))
    .then(() => GameHelper.setupGames(organizations, {
      active: numActive,
      finished: numFinished,
      upcoming: numUpcoming,
    })
      .then((gamesObj) => {
        active = gamesObj.active;
        upcoming = gamesObj.upcoming;
        finished = gamesObj.finished;
        games = active.concat(upcoming, finished);
        return Promise.resolve();
      }))
    .then(() => DonationHelper.setupDonations(organizations, games, users, numDonations)
      .then((createdDonations) => donations = createdDonations)));

afterAll(() => SharedHelper.cleanup({
  users,
  organizations,
  games,
  donations,
})
  .then(() => mongoose.disconnect()));

// TODO test unauthorized admin and admin without ALL permissions
describe('Admins', () => {

  describe('POST /admin/login', () => {

    const admin = AdminHelper.generateAdmin();
    beforeAll(() => SharedHelper.setup({ admins: [admin] }));
    afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

    it('it should allow an admin to login with the proper username and password', () =>
      AdminHelper.adminLogin(admin)
        .then((res) => SharedHelper.loginSuccessful(res)));

    it('it should not allow an admin to login without the proper credentials', () => {
      const creds = {
        email: admin.email,
        password: admin.password + 'extra',
      };
      return AdminHelper.adminLogin(creds)
        .then((res) => SharedHelper.loginFailed(res));
    });

    it('it should not allow a non-existant admin to login', () =>
      AdminHelper.adminLogin(AdminHelper.generateAdmin())
        .then((res) => SharedHelper.loginFailed(res)));
  });

  describe('admin/users', () => {
    describe('GET /admin/users', () => {
      const permissions = Generator.permission(security.permission.R_USER);
      const admin = AdminHelper.generateAdmin({ permissions });
      let user;

      beforeAll(() => {
        user = chance.pickone(users);
        return SharedHelper.setup({ admins: [admin] });
      });
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an authorized admin to view all users', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/users')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'array');
                assert.isAbove(res.body.length, 0);
                UserHelper.isUser(res.body[0]);
                return SharedHelper.assertPagingWorks(server, '/admin/users', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));

      it('it should deny access if the admin is unathenticated', () =>
        chai.request(server)
          .get('/admin/users')
          .set('Authorization', 'asdlkfjasdf')
          .then((res) => {
            assert.equal(res.status, statusCode.UNAUTHORIZED, 'status is 401');
            assert.typeOf(res.body, 'object', 'res is an object');
            assert.property(res.body, 'auth');
            assert.property(res.body, 'error');
            assert.equal(res.body.auth, false, 'auth is false');
            assert.equal(res.body.error, 'you do not have the proper permissions to perform that action');
          }));
    });

    describe('POST /admin/users', () => {

      const permissions = Generator.permission(security.permission.C_USER);
      const admin = AdminHelper.generateAdmin({ permissions });
      const user = UserHelper.generateUser();
      const invalidUser = UserHelper.generateInvalidUser();

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ users: [user], admins: [admin] }));

      it('it should allow an authorized admin to create a new user', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/users')
              .set('Authorization', loginRes.body.token)
              .send(user)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');
                UserHelper.isUser(res.body);
                UserHelper.usersEqual(res.body, user);
              }))
          .then(() => UserHelper.userLogin(user))
          .then((res) => SharedHelper.loginSuccessful(res)));

      it('it should not allow a user to be created with malformed data', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/users')
              .set('Authorization', loginRes.body.token)
              .send(invalidUser)
              .then((res) => SharedHelper.badRequest(res))));
    });

    describe('GET /admin/users/:id', () => {

      const permissions = Generator.permission(security.permission.R_USER);
      const user = UserHelper.generateUser();
      const admin = AdminHelper.generateAdmin({ permissions });

      beforeAll(() => SharedHelper.setup({ users: [user], admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ users: [user], admins: [admin] }));

      it('it should allow an authorized admin to view an existing users information', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/users/' + user._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');
                UserHelper.isUser(res.body);
                UserHelper.usersEqual(res.body, user);
              })));
    });

    describe('PUT /admin/users/:id', () => {

      const permissions = Generator.permission(security.permission.U_USER);
      const admin = AdminHelper.generateAdmin({ permissions });
      let user = UserHelper.generateUser();
      let id;


      beforeEach(() => SharedHelper.setup({ users: [user], admins: [admin] })
        .then(() => id = user._id));
      afterEach(() => SharedHelper.cleanup({ users: [user], admins: [admin] }));

      it('it should allow an authorized admin to update an existing user', () => {
        user = UserHelper.generateUser({ email: user.email, dob: user.dob });
        const updatedInfo = SharedHelper.copy(user);
        delete updatedInfo.email;
        delete updatedInfo.dob;

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/users/' + id)
              .set('Authorization', loginRes.body.token)
              .send(updatedInfo)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');
                UserHelper.isUser(res.body);
                UserHelper.usersEqual(res.body, user);
              }));
      });

      it('it should not allow a user to be created with malformed data', () => {
        const invalidUpdate = UserHelper.generateInvalidUser({ email: user.email });
        delete invalidUpdate.email;

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/users/' + id)
              .set('Authorization', loginRes.body.token)
              .send(invalidUpdate)
              .then((res) => SharedHelper.badRequest(res)))
          .then(() => UserHelper.userLogin(user))
          .then((res) => SharedHelper.loginSuccessful(res));
      });

      it('it should not allow a user to be created with malformed data (empty data)', () => {
        const invalidUpdate = { };

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/users/' + id)
              .set('Authorization', loginRes.body.token)
              .send(invalidUpdate)
              .then((res) => SharedHelper.badRequest(res)))
          .then(() => UserHelper.userLogin(user))
          .then((res) => SharedHelper.loginSuccessful(res));
      });

      // TODO nonexistant users?
    });

    describe('DELETE /admin/users/:id', () => {

      const permissions = Generator.permission(security.permission.D_USER);
      const admin = AdminHelper.generateAdmin({ permissions });
      const user = UserHelper.generateUser();

      beforeAll(() => SharedHelper.setup({ users: [user], admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ users: [user], admins: [admin] }));

      it('it should allow an authorized admin to delete an existing user', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .delete('/admin/users/' + user._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');
                assert.property(res.body, 'success');
                assert.equal(res.body.success, true);
              }))
          .then(() => UserHelper.userLogin(user))
          .then((res) => SharedHelper.loginFailed(res)));
    });
  });

  describe('/admin/admins', () => {

    describe('GET /admin/admins', () => {

      const permissions = Generator.permission(security.permission.R_ADMIN);
      const admin = AdminHelper.generateAdmin({ permissions });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an authorized admin to view a list of all admins', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/admins')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'array');
                assert.isAbove(res.body.length, 0);
                AdminHelper.isAdmin(res.body[0]);
                return SharedHelper.assertPagingWorks(server, '/admin/admins', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));
    });

    describe('GET /admin/account', () => {

      const admin = AdminHelper.generateAdmin();

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an authenticated admin to view his/her own information', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/account')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                AdminHelper.isAdmin(res.body);
                AdminHelper.adminsEqual(res.body, admin);
              })));
    });

    describe('GET /admin/admins/:id', () => {

      const permissions = Generator.permission(security.permission.R_ADMIN);
      const master = AdminHelper.generateAdmin({ permissions });
      const admin = AdminHelper.generateAdmin();

      beforeAll(() => SharedHelper.setup({ admins: [admin, master] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin, master] }));

      it('it should allow an authorized admin to view an admins information by id', () =>
        AdminHelper.adminLogin(master)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/admins/' + admin._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');
                AdminHelper.isAdmin(res.body);
                AdminHelper.adminsEqual(res.body, admin);
              })));
    });

    describe('POST /admin/admins', () => {

      const permissions = Generator.permission(security.permission.C_ADMIN);
      const master = AdminHelper.generateAdmin({ permissions });
      const admin = AdminHelper.generateAdmin();
      const invalidAdmin = AdminHelper.generateInvalidAdmin();

      beforeAll(() => SharedHelper.setup({ admins: [master] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin, master, invalidAdmin] }));

      it('it should allow an authorized admin to create a new admin', () =>
        AdminHelper.adminLogin(master)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/admins')
              .set('Authorization', loginRes.body.token)
              .send(admin)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                AdminHelper.isAdmin(res.body);
                AdminHelper.adminsEqual(res.body, admin);
              }))
          .then(() => AdminHelper.adminLogin(admin))
          .then((res) => SharedHelper.loginSuccessful(res)));

      it('it should not allow an admin to be created with malformed information', () =>
        AdminHelper.adminLogin(master)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/admins')
              .set('Authorization', loginRes.body.token)
              .send(invalidAdmin)
              .then((res) => SharedHelper.badRequest(res))));
    });

    describe('PUT /admin/account', () => {

      let admin = AdminHelper.generateAdmin();

      beforeEach(() => SharedHelper.setup({ admins: [admin] }));
      afterEach(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow a logged in admin to update their own account', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) => {
            admin = AdminHelper.generateAdmin({
              email: admin.email,
              permissions: admin.permissions,
            });
            const update = SharedHelper.copy(admin);
            delete update.email;
            delete update.permissions;

            assert.property(loginRes.body, 'token');
            return chai.request(server)
              .put('/admin/account')
              .set('Authorization', loginRes.body.token)
              .send(update)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                AdminHelper.isAdmin(res.body);
                AdminHelper.adminsEqual(res.body, admin);
              });
          }));

      it('it should not allow a logged in admin to update their own permissions', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) => {
            admin = AdminHelper.generateAdmin({ email: admin.email });
            const update = SharedHelper.copy(admin);
            delete update.email;

            assert.property(loginRes.body, 'token');

            return chai.request(server)
              .put('/admin/account')
              .set('Authorization', loginRes.body.token)
              .send(update)
              .then((res) => {
                assert.equal(res.status, statusCode.UNAUTHORIZED);
                assert.typeOf(res.body, 'object');

                assert.property(res.body, 'auth');
                assert.property(res.body, 'error');
                assert.equal(res.body.auth, false);
                assert.equal(res.body.error, 'you do not have the proper permissions to perform that action');
              });
          }));

      it('it should not allow malformed update data to be used in updating an admin', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) => {
            const invalidUpdate = AdminHelper.generateInvalidAdmin({ email: admin.email });
            delete invalidUpdate.email;
            delete invalidUpdate.permissions;

            return chai.request(server)
              .put('/admin/account')
              .set('Authorization', loginRes.body.token)
              .send(invalidUpdate)
              .then((res) => SharedHelper.badRequest(res));
          }));
    });

    describe('PUT /admin/admins/:id', () => {

      const permissions = Generator.permission(security.permission.U_ADMIN);
      const master = AdminHelper.generateAdmin({ permissions });
      let admin = AdminHelper.generateAdmin();
      let id;
      beforeAll(() => SharedHelper.setup({ admins: [admin, master] })
        .then(() => id = admin._id));
      afterAll(() => SharedHelper.cleanup({ admins: [admin, master] }));

      it('it should allow an authorized admin to update an admin', () => {
        admin = AdminHelper.generateAdmin({ email: admin.email });
        const update = SharedHelper.copy(admin);
        delete update.email;

        return AdminHelper.adminLogin(master)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/admins/' + id)
              .set('Authorization', loginRes.body.token)
              .send(update)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                AdminHelper.isAdmin(res.body);
                AdminHelper.adminsEqual(res.body, admin);
              }))
          .then(() => AdminHelper.adminLogin(admin))
          .then((res) => SharedHelper.loginSuccessful(res));
      });

      it('it should not allow malformed update data to be used in updating an admin', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) => {
            const invalidUpdate = AdminHelper.generateInvalidAdmin({ email: admin.email });
            delete invalidUpdate.email;

            return chai.request(server)
              .put('/admin/admins/' + id)
              .set('Authorization', loginRes.body.token)
              .send(invalidUpdate)
              .then((res) => SharedHelper.badRequest(res));
          }));
    });

    // check admin length
    describe('DELETE /admin/admins/:id', () => {

      const permissions = Generator.permission(security.permission.D_ADMIN);
      const master = AdminHelper.generateAdmin({ permissions });
      const admin = AdminHelper.generateAdmin();

      beforeAll(() => SharedHelper.setup({ admins: [admin, master] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin, master] }));

      it('it should allow an authorized admin to delete another admin', () =>
        AdminHelper.adminLogin(master)
          .then((loginRes) =>
            chai.request(server)
              .delete('/admin/admins/' + admin._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK, 'status is 200');
                assert.typeOf(res.body, 'object', 'res is an object');

                assert.property(res.body, 'success');
                assert.equal(res.body.success, true);
              }))
          .then(() => AdminHelper.adminLogin(admin))
          .then((res) => SharedHelper.loginFailed(res)));
    });
  });

  describe('/admin/organizations', () => {

    describe('GET /admin/organizations', () => {

      const permissions = Generator.permission(security.permission.R_ORGANIZATION);
      const admin = AdminHelper.generateAdmin({ permissions });
      const orgs = [];
      let length;

      beforeAll(() => {
        length = chance.integer({ min: 3, max: 10 });
        for (let i = 0; i < length; i++)
          orgs.push(OrganizationHelper.generateOrganization());
        return SharedHelper.setup({ admins: [admin], organizations: orgs });
      });
      afterAll(() => SharedHelper.cleanup({ admins: [admin], organizations: orgs }));

      it('it should return a list of all organizations', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/organizations')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                OrganizationHelper.isOrganization(res.body[0]);
                return SharedHelper.assertPagingWorks(server, '/admin/organizations', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));
    });


    describe('GET /admin/organizations/:id', () => {

      const permissions = Generator.permission(security.permission.R_ORGANIZATION);
      const admin = AdminHelper.generateAdmin({ permissions });
      const orgs = [];
      let length;

      beforeAll(() => {
        length = chance.integer({ min: 3, max: 10 });
        for (let i = 0; i < length; i++)
          orgs.push(OrganizationHelper.generateOrganization());
        return SharedHelper.setup({ admins: [admin], organizations: orgs });
      });
      afterAll(() => SharedHelper.cleanup({ admins: [admin], organizations: orgs }));

      it('it should get the proper organization when given id', () => {
        const index = chance.integer({ min: 0, max: length - 1 });

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/organizations/' + orgs[index]._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                OrganizationHelper.isOrganization(res.body);
                OrganizationHelper.organizationsEqual(res.body, orgs[index]);
              }));
      });
    });


    describe('POST /admin/organizations', () => {

      const permission = Generator.permission(security.permission.C_ORGANIZATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });
      const org = OrganizationHelper.generateOrganization();
      const invalidOrg = OrganizationHelper.generateInvalidOrganization();

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin], organizations: [org] }));

      it('it should allow an authorized admin to create a new organization', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/organizations')
              .set('Authorization', loginRes.body.token)
              .send(org)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                OrganizationHelper.isOrganization(res.body);
                OrganizationHelper.organizationsEqual(res.body, org);
              })));

      it('it should not allow a malformed organization to be created', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/organizations')
              .set('Authorization', loginRes.body.token)
              .send(invalidOrg)
              .then((res) => SharedHelper.badRequest(res))));
    });


    describe('PUT /admin/organizations/:id', () => {

      const permission = Generator.permission(security.permission.U_ORGANIZATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });
      let org = OrganizationHelper.generateOrganization();

      beforeEach(() => SharedHelper.setup({ admins: [admin], organizations: [org] }));
      afterEach(() => SharedHelper.cleanup({ admins: [admin], organizations: [org] }));

      it("it should allow an authorized admin to update an organization's information", () => {
        const id = org._id;
        org = OrganizationHelper.generateOrganization();

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/organizations/' + id)
              .set('Authorization', loginRes.body.token)
              .send(org)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                OrganizationHelper.isOrganization(res.body);
                OrganizationHelper.organizationsEqual(res.body, org);
              }));

        // TODO malformed
      });

      it('it should not allow a malformed organization update to be made', () => {
        const id = org._id;
        const invalidUpdate = OrganizationHelper.generateInvalidOrganization();

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/organizations/' + id)
              .set('Authorization', loginRes.body.token)
              .send(invalidUpdate)
              .then((res) => SharedHelper.badRequest(res)));
      });
    });

    describe('DELETE /admin/organizations/:id', () => {

      const permission = Generator.permission(security.permission.D_ORGANIZATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });
      const org = OrganizationHelper.generateOrganization();

      beforeAll(() => SharedHelper.setup({ admins: [admin], organizations: [org] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin], organizations: [org] }));

      it('it should allow an authorized admin to delete an organization', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .delete('/admin/organizations/' + org._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                assert.property(res.body, 'success');
                assert.equal(res.body.success, true);
              })));
    });
  });

  describe('/admin/games', () => {

    describe('GET /admin/games/', () => {

      const permission = Generator.permission(security.permission.R_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should retrieve the list of all games', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return SharedHelper.assertPagingWorks(server, '/admin/games', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));


      it('it should populate the games when the populate in query is true', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games')
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsPopulated(res.body[0]);
              })));

      it('it should not populate the games if populate in query is false', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games')
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsNotPopulated(res.body[0]);
              })));

      it('it should not populate the games if populate in query is missing', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsNotPopulated(res.body[0]);
              })));
    });

    describe('GET /admin/games/:id', () => {

      const permission = Generator.permission(security.permission.R_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should retrieve the requested game', () => {
        const game = chance.pickone(games);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/' + game._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                GameHelper.gamesEqual(game, res.body);
              }));
      });

      it('it should populate the game when the populate in query is true', () => {
        const game = chance.pickone(games);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/' + game._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsPopulated(res.body);
              }));
      });

      it('it should not populate the game if populate in query is false', () => {
        const game = chance.pickone(games);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/' + game._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsNotPopulated(res.body);
              }));
      });

      it('it should not populate the game if populate in query is missing', () => {
        const game = chance.pickone(games);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/' + game._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsNotPopulated(res.body);
              }));
      });
    });

    describe('POST /admin/games/', () => {

      const permission = Generator.permission(security.permission.C_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });
      let inactiveGame;
      let activeGame;

      beforeAll(() => {
        inactiveGame = GameHelper.generateGame(chance.pickset(organizations, 4), {},
          { active: false });
        activeGame = GameHelper.generateGame(chance.pickset(organizations, 4), {},
          { active: true });
        return SharedHelper.setup({ admins: [admin] });
      });
      afterAll(() => SharedHelper.cleanup({ admins: [admin], games: [inactiveGame, activeGame] }));

      it('it should allow an admin to make an active game', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/games/')
              .set('Authorization', loginRes.body.token)
              .send(activeGame)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                GameHelper.gamesEqual(res.body, activeGame);
                activeGame._id = res.body._id;
              })));

      it('it should allow an admin to make an inactive game', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .post('/admin/games/')
              .set('Authorization', loginRes.body.token)
              .send(inactiveGame)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body, 'object');
                GameHelper.gamesEqual(res.body, inactiveGame);
              })));

      // TODO test malformed
    });

    describe('DELETE /admin/games/:id', () => {

      const permission = Generator.permission(security.permission.D_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an admin to delete a game', () => {
        const game = chance.pickone(games);
        games = games.filter((g) => g != game);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .delete('/admin/games/' + game._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                assert.property(res.body, 'success');
                assert.equal(res.body.success, true);
              }));
      });
    });

    describe('PUT /admin/games/:id', () => {

      const permission = Generator.permission(security.permission.U_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });
      let game = GameHelper.generateGame(organizations);

      beforeAll(() => SharedHelper.setup({ admins: [admin], games: [game] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin], games: [game] }));

      it('it should update a specified games information', () => {
        const id = game._id;
        game = GameHelper.generateGame(organizations);
        delete game.winningTile;

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .put('/admin/games/' + id)
              .set('Authorization', loginRes.body.token)
              .send(game)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                GameHelper.gamesEqual(res.body, game);
              }));
      });
    });

    describe('GET /admin/games/active/:id', () => {

      const permission = Generator.permission(security.permission.R_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should retrieve a specified active game by id', () => {

        const activeGame = chance.pickone(active);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active/' + activeGame._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                GameHelper.gamesEqual(res.body, activeGame);
              }));
      });

      it('it should populate the active game when the populate in query is true', () => {
        const activeGame = chance.pickone(active);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active/' + activeGame._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsPopulated(res.body);
              }));
      });

      it('it should not populate the active game if populate in query is false', () => {
        const activeGame = chance.pickone(active);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active/' + activeGame._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsNotPopulated(res.body);
              }));
      });

      it('it should not populate the active game if populate in query is missing', () => {
        const activeGame = chance.pickone(active);

        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active/' + activeGame._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                GameHelper.isGame(res.body);
                return GameHelper.assertIsNotPopulated(res.body);
              }));
      });
    });

    describe('GET /admin/games/active', () => {

      const permission = Generator.permission(security.permission.R_GAME);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should retrieve a list of all active games', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                res.body.map((g) => GameHelper.gameIsActive(g));
                return SharedHelper.assertPagingWorks(server, '/admin/games/active', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));

      it('it should populate the active games when the populate in query is true', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active')
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsPopulated(res.body[0]);
              })));

      it('it should not populate the active games if populate in query is false', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active')
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsNotPopulated(res.body[0]);
              })));

      it('it should not populate the active games if populate in query is missing', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/games/active')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');
                GameHelper.isGame(res.body[0]);
                return GameHelper.assertIsNotPopulated(res.body[0]);
              })));
    });
  });

  describe('/admin/donations', () => {

    describe('GET /admin/donations', () => {

      const permission = Generator.permission(security.permission.R_DONATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should return a list of all donations', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');

                DonationHelper.isDonation(res.body[0]);
                return SharedHelper.assertPagingWorks(server, '/admin/donations', res.header[numPagesHeaderName],
                  loginRes.body.token);
              })));

      it('it should populate the donations if the populate in query is true', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations')
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');

                DonationHelper.isDonation(res.body[0]);
                return DonationHelper.assertIsPopulated(res.body[0]);
              })));

      it('it should not populate the donations if the populate in query is false', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations')
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');

                DonationHelper.isDonation(res.body[0]);
                return DonationHelper.assertIsNotPopulated(res.body[0]);
              })));

      it('it should not populate the donations if the populate in query is missing', () =>
        AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations')
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'array');

                DonationHelper.isDonation(res.body[0]);
                return DonationHelper.assertIsNotPopulated(res.body[0]);
              })));
    });

    describe('GET /admin/donations/:id', () => {

      const permission = Generator.permission(security.permission.R_DONATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an admin to access a specific donation', () => {
        const donation = chance.pickone(donations);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations/' + donation._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                DonationHelper.isDonation(res.body);
                DonationHelper.donationsEqual(res.body, donation);
              }));
      });

      it('it should populate the donation if the populate in query is true', () => {
        const donation = chance.pickone(donations);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations/' + donation._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: true })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                DonationHelper.isDonation(res.body);
                DonationHelper.donationsEqual(res.body, donation);
                return DonationHelper.assertIsPopulated(res.body);
              }));
      });

      it('it should not populate the donation if the populate in query is false', () => {
        const donation = chance.pickone(donations);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations/' + donation._id)
              .set('Authorization', loginRes.body.token)
              .query({ populate: false })
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                DonationHelper.isDonation(res.body);
                DonationHelper.donationsEqual(res.body, donation);
                return DonationHelper.assertIsNotPopulated(res.body);
              }));
      });

      it('it should not populate the donation if the populate in query is missing', () => {
        const donation = chance.pickone(donations);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .get('/admin/donations/' + donation._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');

                DonationHelper.isDonation(res.body);
                DonationHelper.donationsEqual(res.body, donation);
                return DonationHelper.assertIsNotPopulated(res.body);
              }));
      });
    });

    describe('DELETE /admin/donations/:id', () => {

      const permission = Generator.permission(security.permission.D_DONATION);
      const admin = AdminHelper.generateAdmin({ permissions: permission });

      beforeAll(() => SharedHelper.setup({ admins: [admin] }));
      afterAll(() => SharedHelper.cleanup({ admins: [admin] }));

      it('it should allow an admin to access a specific donation', () => {
        const donation = chance.pickone(donations);
        return AdminHelper.adminLogin(admin)
          .then((loginRes) =>
            chai.request(server)
              .delete('/admin/donations/' + donation._id)
              .set('Authorization', loginRes.body.token)
              .then((res) => {
                assert.equal(res.status, statusCode.OK);
                assert.typeOf(res.body, 'object');
                assert.property(res.body, 'success');
                assert.equal(res.body.success, true);
              }));
      });
    });
  });
});
