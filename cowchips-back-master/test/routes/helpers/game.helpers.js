import chai from 'chai';
import moment from 'moment';
import chance from 'chance';

import Game from '../../../src/schemas/game.schema';
import SharedHelper from './shared.helpers';
import Generator from './generator';

import GameValidator from '../../../src/validators/game.validator';
import OrganizationValidator from '../../../src/validators/organization.validator';

const assert = chai.assert;

export default class GameHelper
{
  static isGame(data)
  {
    GameValidator.validateIsGame(data);
  }

  static gameIsActive(g)
  {
    const now = moment.utc();

    const start = moment.utc(g.startTime);
    const end = moment.utc(g.endTime);
    assert.equal(start <= now, true);
    assert.equal(now <= end, true);
  }

  static gamesEqual(g1, g2)
  {
    assert.equal(g1.name, g2.name);

    assert.equal(g1.organizations.length, g2.organizations.length);
    // for (let i = 0; i < g1.organizations.length; i++)
    //   assert.equal(g1.organizations[i]._id, g2.organizations[i]);

    assert.equal(g1.winningTile, g2.winningTile);

    assert.equal(g1.board.length, g2.board.length);
    for (let i = 0; i < g1.board; i++)
      assert.equal(g1.board[i], g2.board[i]);

    assert.equal(g1.price, g2.price);
    assert.equal(g1.url, g2.url);

    SharedHelper.assertDatesEqual(g1.startTime, g2.startTime);
    SharedHelper.assertDatesEqual(g1.endTime, g2.endTime);
  }

  static generateInvalidGame(presets = {})
  {
    return {
      name: (presets.name !== undefined) ?
        presets.name : Generator.invalidName(),
      organizations: (presets.organizations !== undefined) ?
        presets.organizations : Generator.invalidStringArray(),
      startTime: (presets.startTime !== undefined) ?
        presets.startTime : Generator.invalidDate(),
      endTime: (presets.endTime !== undefined) ?
        presets.endTime : Generator.invalidDate(),
      winningTile: (presets.winningTile !== undefined) ?
        presets.winningTile : null,
      board: (presets.board !== undefined) ?
        presets.board : Generator.invalidBoard(),
      price: (presets.price !== undefined) ?
        presets.price : Generator.invalidPrice(),
      streamUrl: (presets.streamUrl !== undefined) ?
        presets.streamUrl : Generator.invalidStreamUrl(),
    };
  }

  static generateGame(orgs = [], presets = {}, options = {})
  {
    // build organizations
    const organizations = [];
    orgs.map((org) => (
      (org._id !== undefined) ?
        organizations.push(org._id) :
        new Error('organizations must have _id to add game to db')));

    // setup game start and end times
    let startTime;
    let endTime;

    const now = moment.utc();

    if (presets.startTime !== undefined)
      presets.startTime = moment.utc(presets.startTime);
    if (presets.endTime !== undefined)
      presets.endTime = moment.utc(presets.endTime);

    if (options.active)
    {
      startTime = (presets.startTime) ?
        presets.startTime :
        Generator.date({ before: now });

      endTime = (presets.endTime) ?
        presets.endTime :
        Generator.date({ after: now });
    }
    else if (options.finished)
    {
      endTime = (presets.endTime) ?
        presets.endTime :
        Generator.date({ before: now });

      startTime = (presets.startTime) ?
        presets.startTime :
        Generator.date({ before: endTime });
    }
    else if (options.upcoming)
    {
      startTime = (presets.startTime) ?
        presets.startTime :
        Generator.date({ after: now });

      endTime = (presets.endTime) ?
        presets.endTime :
        Generator.date({ after: startTime });
    }
    else
    {
      startTime = (presets.startTime) ? presets.startTime : Generator.date({ after: now });
      endTime = (presets.endTime) ? presets.endTime : Generator.date({ after: startTime });
    }

    return {
      name: (presets.name !== undefined) ? presets.name : Generator.name(),
      organizations,
      startTime,
      endTime,
      winningTile: (presets.winningTile !== undefined) ? presets.winningTile : null,
      board: (presets.board !== undefined) ? presets.board : Generator.board(),
      price: (presets.price !== undefined) ? presets.price : Generator.price(),
      streamUrl: (presets.streamUrl !== undefined) ? presets.streamUrl : Generator.streamUrl(),
    };
  }

  static selectAndUpdateWinningTile(game)
  {
    const tile = chance.pickone(game.board);

    game.winningTile = tile;

    const update = { winningTile: game.winningTile };
    return Game.findByIdAndUpdate(game._id, update);
  }

  static createGame(game)
  {
    return Game.create(game)
      .then((created) => game._id = created._id);
  }

  static deleteGame(game)
  {
    return Game.deleteOne({ name: game.name });
  }

  static setupGames(orgs, options = {})
  {
    if (options.active === undefined)
      options.active = 0;
    if (options.upcoming === undefined)
      options.upcoming = 0;
    if (options.finished === undefined)
      options.finished = 0;

    const promises = [];
    const active = [];
    const finished = [];
    const upcoming = [];
    if (options.finished === 0 && options.active === 0 && options.upcoming === 0)
    {
      const num = chance.integer({ min: 10, max: 20 });
      for (let i = 0; i < num; i++)
      {
        const game = this.generateGame(orgs);
        const now = moment.utc();
        const start = moment.utc(game.startTime);
        const end = moment.utc(game.endTime);
        if (start <= now && now <= end)
          active.push(game);
        else if (start >= now)
          upcoming.push(game);
        else if (start <= now && end <= now)
          finished.push(game);

        promises.push(this.createGame(game));
      }
    }
    else
    {
      for (let i = 0; i < options.active; i++)
      {
        const game = this.generateGame(orgs, {}, { active: true });
        active.push(game);
        promises.push(this.createGame(game));
      }
      for (let i = 0; i < options.upcoming; i++)
      {
        const game = this.generateGame(orgs, {}, { upcoming: true });
        upcoming.push(game);
        promises.push(this.createGame(game));
      }
      for (let i = 0; i < options.finished; i++)
      {
        const game = this.generateGame(orgs, {}, { finished: true });
        finished.push(game);
        promises.push(this.createGame(game));
      }
    }

    return Promise.all(promises)
      .then(() => Promise.resolve({
        finished,
        active,
        upcoming,
      }));
  }

  static assertIsPopulated(game)
  {
    return OrganizationValidator.validateIsOrganization(game.organizations[0])
      .catch((err) => { throw err; });
  }

  static assertIsNotPopulated(game)
  {
    assert.equal(typeof game.organizations[0], 'string');
  }
}
