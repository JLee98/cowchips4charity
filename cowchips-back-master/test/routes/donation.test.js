import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';

import { statusCode } from '../../src/response';
import server from '../../src/server';
import SharedHelper from './helpers/shared.helpers';

import DonationHelper from './helpers/donation.helpers';
import OrganizationHelper from './helpers/organization.helpers';
import GameHelper from './helpers/game.helpers';
import UserHelper from './helpers/user.helpers';

import { numPagesHeaderName } from '../../src/config';

const chance = new Chance();

const assert = chai.assert;

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
    .then(() => OrganizationHelper.setupOrganizations(numOrgs)
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
    .then(() => DonationHelper.setupDonations(organizations, games, users, numDonations))
    .then((createdDonations) => donations = createdDonations));

afterAll(() => SharedHelper.cleanup({
  users,
  organizations,
  games,
  donations,
})
  .then(() => mongoose.disconnect()));

describe('Donation', () => {

  describe('GET /donation', () => {
    let u;
    beforeAll(() => {
      const donation = chance.pickone(donations);
      for (let i = 0; i < users.length; i++)
      {
        if (users[i]._id === donation.userID)
        {
          u = users[i];
          break;
        }
      }

      if (u === undefined)
        console.error('No user designated');

      return Promise.resolve();
    });

    it('it should return a list of all donations', () =>
      UserHelper.userLogin(u)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation')
            .set('Authorization', loginRes.body.token)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'array');

              DonationHelper.isDonation(res.body[0]);
              return SharedHelper.assertPagingWorks(server, '/donation', res.header[numPagesHeaderName],
                loginRes.body.token);
            })));

    it('it should populate the donations if the populate in query is true', () =>
      UserHelper.userLogin(u)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation')
            .set('Authorization', loginRes.body.token)
            .query({ populate: true })
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'array');

              DonationHelper.isDonation(res.body[0]);
              return DonationHelper.assertIsPopulated(res.body[0]);
            })));

    it('it should not populate the donations if the populate in query is false', () =>
      UserHelper.userLogin(u)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation')
            .set('Authorization', loginRes.body.token)
            .query({ populate: false })
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'array');

              DonationHelper.isDonation(res.body[0]);
              return DonationHelper.assertIsNotPopulated(res.body[0]);
            })));

    it('it should not populate the donations if the populate in query is missing', () =>
      UserHelper.userLogin(u)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation')
            .set('Authorization', loginRes.body.token)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'array');

              DonationHelper.isDonation(res.body[0]);
              return DonationHelper.assertIsNotPopulated(res.body[0]);
            })));
  });

  describe('GET /donation/:id', () => {
    let donation;
    let user;
    beforeAll(() => {
      donation = chance.pickone(donations);
      for (let i = 0; i < users.length; i++)
      {
        if (users[i]._id === donation.userID)
        {
          user = users[i];
          break;
        }
      }

      if (user === undefined)
        console.error('No user designated');

      return Promise.resolve();
    });

    it('it should get the specified donation when given id', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation/' + donation._id)
            .set('Authorization', loginRes.body.token)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              DonationHelper.isDonation(res.body);
              DonationHelper.donationsEqual(res.body, donation);
            })));

    it('it should populate the donations if the populate in query is true', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation/' + donation._id)
            .set('Authorization', loginRes.body.token)
            .query({ populate: true })
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              DonationHelper.isDonation(res.body);
              DonationHelper.donationsEqual(res.body, donation);
              return DonationHelper.assertIsPopulated(res.body);
            })));

    it('it should not populate the donations if the populate in query is false', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation/' + donation._id)
            .set('Authorization', loginRes.body.token)
            .query({ populate: false })
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              DonationHelper.isDonation(res.body);
              DonationHelper.donationsEqual(res.body, donation);
              return DonationHelper.assertIsNotPopulated(res.body);
            })));

    it('it should not populate the donations if the populate in query is missing', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .get('/donation/' + donation._id)
            .set('Authorization', loginRes.body.token)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              DonationHelper.isDonation(res.body);
              DonationHelper.donationsEqual(res.body, donation);
              return DonationHelper.assertIsNotPopulated(res.body);
            })));
  });

  describe('POST /donation', () => {

    let user;
    let activeGameDonation;
    let upcomingGameDonation;
    let nonGameDonation;
    let finishedGameDonation;

    beforeAll(() => {
      user = chance.pickone(users);
      activeGameDonation = DonationHelper.generateStripePayment(active);
      nonGameDonation = DonationHelper.generateStripePayment();
      finishedGameDonation = DonationHelper.generateStripePayment(finished);
      upcomingGameDonation = DonationHelper.generateStripePayment(upcoming);

      return Promise.resolve();
    });
    afterAll(() => DonationHelper.deleteDonationsForUser(user));

    it('it should allow for donations to be made for active games', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .post('/donation')
            .set('Authorization', loginRes.body.token)
            .send(activeGameDonation)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              assert.property(res.body, 'success');
              assert.equal(res.body.success, true);
            })));

    it('it should allow for donations to be made for upcoming games', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .post('/donation')
            .set('Authorization', loginRes.body.token)
            .send(upcomingGameDonation)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              assert.property(res.body, 'success');
              assert.equal(res.body.success, true);
            })));

    it('it should allow for donations to be made to no game', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .post('/donation')
            .set('Authorization', loginRes.body.token)
            .send(nonGameDonation)
            .then((res) => {
              assert.equal(res.status, statusCode.OK);
              assert.typeOf(res.body, 'object');

              assert.property(res.body, 'success');
              assert.equal(res.body.success, true);
            })));

    it('it should not allow for a donation to be made for a finished game', () =>
      UserHelper.userLogin(user)
        .then((loginRes) =>
          chai.request(server)
            .post('/donation')
            .set('Authorization', loginRes.body.token)
            .send(finishedGameDonation)
            .then((res) => {
              assert.equal(res.status, statusCode.RESOURCE_NOT_FOUND);
              assert.typeOf(res.body, 'object');

              assert.property(res.body, 'auth');
              assert.typeOf(res.body.auth, 'boolean');

              assert.property(res.body, 'error');
              assert.typeOf(res.body.error, 'string');

              assert.equal(res.body.auth, false);
              assert.equal(res.body.error, 'That game is no longer active');
            })));
  });
});
