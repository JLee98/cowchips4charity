import GameModel from '../models/game.model';
import { error } from '../response';
import { numPagesHeaderName } from '../config';
import { ResourceNotFoundError } from '../errors';

export default class GamesController
{
  static getGame(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    GameModel.findOneGame({ _id: req.params.id }, { populate })
      .then((game) => res.json(game))
      .catch((err) => error(res, err));
  }

  static getAllGames(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = (req.query.page !== undefined) ? req.query.page : 1;
    const filter = req.body;

    GameModel.findGames(filter, { page, populate })
      .then((games) => GameModel.__getGamesPageCount(filter)
        .then((count) => {
          if (page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(games);
        }))
      .catch((err) => error(res, err));
  }

  static addGame(req, res)
  {
    GameModel.verifyOrganizations(req.body.organizations)
      .then(() => GameModel.createGame(req.body))
      .then((game) => res.json(game))
      .catch((err) => error(res, err));
  }

  static deleteGame(req, res)
  {
    GameModel.deleteGameById(req.params.id)
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static updateGame(req, res)
  {
    GameModel.editGame(req.params.id, req.body)
      .then((updatedGame) => res.json(updatedGame))
      .catch((err) => error(res, err));
  }

  static getAllActiveGames(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = (req.query.page !== undefined) ? req.query.page : 1;
    const filter = req.body;

    GameModel.findActiveGames(filter, { page, populate })
      .then((activeGames) => GameModel.__getActiveGamesPageCount(filter)
        .then((count) => {
          if (page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(activeGames);
        }))
      .catch((err) => error(res, err));
  }

  static getActiveGame(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    GameModel.findOneActiveGame({ _id: req.params.id }, { populate })
      .then((activeGame) => res.json(activeGame))
      .catch((err) => error(res, err));
  }
}
