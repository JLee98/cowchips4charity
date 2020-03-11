import moment from 'moment';

import { DatabaseError, ResourceNotFoundError, BadRequestError } from '../errors';
import { pageSize, defaults } from '../config';
import Game from '../schemas/game.schema';
import GameValidator from '../validators/game.validator';
import OrganizationModel from './organization.model';

export default class GameModel
{
  static fetchGames(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.populate === undefined)
      options.populate = false;

    let games = Game.find(filter);

    if (options.page)
      games = games
        .skip(pageSize * (options.page - 1))
        .limit(pageSize);

    games = games.select(options.projection);

    if (!options.populate)
      return games
        .catch((err) => { throw new DatabaseError(err); });

    return GameModel.populate(games);
  }

  static findGames(filter = {}, options = {})
  {
    return GameModel.fetchGames(filter, options)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static findOneGame(filter, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.populate === undefined)
      options.populate = defaults.populate;

    const game = Game.findOne(filter)
      .select(options.projection);

    if (!options.populate)
      return game;

    return GameModel.populate(game);
  }

  static findActiveGames(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.page === undefined)
      options.page = 1;
    if (options.populate === undefined)
      options.populate = defaults.populate;

    // TODO should we avoid this overwrite?
    const now = moment.utc().toDate();
    filter.startTime = { $lt: now };
    filter.endTime = { $gt: now };
    const games = Game.find(filter)
      .skip(pageSize * (options.page - 1))
      .limit(pageSize)
      .select(options.projection);

    if (!options.populate)
      return games;

    return GameModel.populate(games);
  }

  static findOneActiveGame(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.populate === undefined)
      options.populate = false;

    const now = moment.utc().toDate();
    filter.startTime = { $lt: now };
    filter.endTime = { $gt: now };

    const game = Game.findOne(filter)
      .select(options.projection);

    if (!options.populate)
      return game;

    return GameModel.populate(game);
  }

  static createGame(game)
  {
    return GameValidator.validateCreateGame(game)
      .then(() => Game.create(game)
        .catch((err) => { throw new DatabaseError(err); }));
  }

  static deleteGameById(id)
  {
    return Game.findByIdAndDelete(id)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static editGame(id, update)
  {
    return GameValidator.validateEditGame(update)
      .then(() => Game.findByIdAndUpdate(id, update, { new: true, projection: defaults.projection })
        .catch((err) => { throw new DatabaseError(err); }));
  }

  static setWinningTile(id, tile)
  {
    return Game.findOne({ _id: id })
      .catch((err) => { throw new DatabaseError(err); })
      .then((game) => {
        // make sure game doesn't already have a winning tile set
        if (!game.winningTile)
          return GameModel.editGame(id, { winningTile: tile })
            .then(() => {

              // if the game isn't already finished, then set the game as finished
              if (!GameModel.gameIsFinished(game))
                return GameModel.editGame(id, { endTime: moment.utc().toDate() });
              // otherwise do nothing more
              return Promise.resolve();
            })
            .catch((err) => { throw new DatabaseError(err); });
        else
          throw new BadRequestError('That game already has a winning tile!');
      });
  }

  static __getGamesPageCount(filter = {})
  {
    return Game.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static __getActiveGamesPageCount(filter = {})
  {
    const now = moment.utc().toDate();
    filter.startTime = { $lt: now };
    filter.endTime = { $gt: now };
    return Game.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static gameIsFinished(game)
  {
    return moment.utc(game.endTime) < moment.utc();
  }

  static verifyOrganizations(orgs)
  {
    return OrganizationModel.findOrganizations({ _id: { $in: orgs } })
      .then((organizations) => {
        if (organizations.length !== orgs.length)
          throw new ResourceNotFoundError('That list of organizations is invalid');
        return true;
      });
  }

  static populate(g, filter = undefined)
  {
    const populator = {};
    populator.organizations = { path: 'organizations', select: defaults.projection };

    if (filter !== undefined)
      populator[filter.path].match = filter.match;

    return g.populate(populator.organizations)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static searchGames(filter, options)
  {
    if (filter.path === undefined)
      return GameModel.findGames(filter, options);
    else
      return GameModel.fetchGames({}, options)
        .populate(filter)
        .then((populated) => populated
          .filter(g => g[filter.path])
          .then(g => GameModel.populate(g)))
        .catch((err) => { throw new DatabaseError(err); });
  }
}
