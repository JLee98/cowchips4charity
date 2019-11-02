import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';

import { statusCode } from '../../src/response';
import server from '../../src/server';
import SharedHelper from './helpers/shared.helpers';
import OrganizationHelper from './helpers/organization.helpers';
import GameHelper from './helpers/game.helpers';

import { numPagesHeaderName } from '../../src/config';

const chance = new Chance();

const assert = chai.assert;

chai.use(chaiHttp);

const numOrgsBounds = { min: 8, max: 20 };
const numActiveBounds = { min: 1, max: 2 };
const numInactiveBounds = { min: 3, max: 6 };

let organizations;
let active;
let games;

const numOrgs = chance.integer(numOrgsBounds);
const numActive = chance.integer(numActiveBounds);
const numInactive = chance.integer(numInactiveBounds);
const numFinished = Math.ceil(numInactive / 2);
const numUpcoming = numInactive - numFinished;

beforeAll(() => OrganizationHelper.setupOrganizations(numOrgs)
  .then((orgs) => organizations = orgs)
  .then(() => GameHelper.setupGames(organizations, {
    active: numActive,
    finished: numFinished,
    upcoming: numUpcoming,
  }))
  .then((gamesObj) => {
    active = gamesObj.active;
    games = gamesObj.active.concat(gamesObj.upcoming, gamesObj.finished);
  }));

afterAll(() => SharedHelper.cleanup({ organizations, games })
  .then(() => mongoose.disconnect()));

describe('Game', () => {

  describe('GET /game', () => {

    it('it should retrieve the list of all games', () =>
      chai.request(server)
        .get('/game')
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return SharedHelper.assertPagingWorks(server, '/game', res.header[numPagesHeaderName]);
        }));

    it('it should populate the games when the populate in query is true', () =>
      chai.request(server)
        .get('/game')
        .query({ populate: true })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsPopulated(res.body[0]);
        }));

    it('it should not populate the games if populate in query is false', () =>
      chai.request(server)
        .get('/game')
        .query({ populate: false })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsNotPopulated(res.body[0]);
        }));

    it('it should not populate the games if populate in query is missing', () =>
      chai.request(server)
        .get('/game')
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsNotPopulated(res.body[0]);
        }));
  });

  describe('GET /game/:id', () => {

    it('it should retrieve the requested game', () => {
      const game = chance.pickone(games);

      return chai.request(server)
        .get('/game/' + game._id)
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          GameHelper.gamesEqual(game, res.body);
        });
    });

    it('it should populate the games when the populate in query is true', () => {
      const game = chance.pickone(games);

      return chai.request(server)
        .get('/game/' + game._id)
        .query({ populate: true })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsPopulated(res.body);
        });
    });

    it('it should not populate the games when the populate in query is false', () => {
      const game = chance.pickone(games);

      return chai.request(server)
        .get('/game/' + game._id)
        .query({ populate: false })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsNotPopulated(res.body);
        });
    });

    it('it should not populate the games when the populate in query is missing', () => {
      const game = chance.pickone(games);

      return chai.request(server)
        .get('/game/' + game._id)
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsNotPopulated(res.body);
        });
    });
  });

  describe('GET /game/active', () => {

    it('it should retrieve a list of all active games', () =>
      chai.request(server)
        .get('/game/active')
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          res.body.map((g) => GameHelper.gameIsActive(g));
          return SharedHelper.assertPagingWorks(server, '/game/active', res.header[numPagesHeaderName]);
        }));

    it('it should populate the active games when the populate in query is true', () =>
      chai.request(server)
        .get('/game/active')
        .query({ populate: true })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsPopulated(res.body[0]);
        }));

    it('it should not populate the active games if populate in query is false', () =>
      chai.request(server)
        .get('/game/active')
        .query({ populate: false })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsNotPopulated(res.body[0]);
        }));

    it('it should not populate the active games if populate in query is missing', () =>
      chai.request(server)
        .get('/game/active')
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          GameHelper.isGame(res.body[0]);
          return GameHelper.assertIsNotPopulated(res.body[0]);
        }));
  });

  describe('GET /game/active/:id', () => {

    it('it should retrieve a specified active game by id', () => {

      const activeGame = chance.pickone(active);

      return chai.request(server)
        .get('/game/active/' + activeGame._id)
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          GameHelper.gamesEqual(res.body, activeGame);
        });
    });

    it('it should populate the games when the populate in query is true', () => {
      const game = chance.pickone(active);

      return chai.request(server)
        .get('/game/active/' + game._id)
        .query({ populate: true })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsPopulated(res.body);
        });
    });

    it('it should not populate the games when the populate in query is false', () => {
      const game = chance.pickone(active);

      return chai.request(server)
        .get('/game/active/' + game._id)
        .query({ populate: false })
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsNotPopulated(res.body);
        });
    });

    it('it should not populate the games when the populate in query is missing', () => {
      const game = chance.pickone(active);

      return chai.request(server)
        .get('/game/active/' + game._id)
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');
          GameHelper.isGame(res.body);
          return GameHelper.assertIsNotPopulated(res.body);
        });
    });
  });
});
