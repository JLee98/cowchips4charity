import express from 'express';

import GameController from '../controllers/game.controller';
import { dateParser } from '../middleware/game.middleware';


'use strict';

const gameRoutes = express();
gameRoutes.use('/', dateParser);

gameRoutes.route('/')
  .get(GameController.getAllGames);

gameRoutes.route('/active')
  .get(GameController.getAllActiveGames);

gameRoutes.route('/active/:id')
  .get(GameController.getActiveGame);

gameRoutes.route('/:id')
  .get(GameController.getGame);

gameRoutes.route('/active/games')
  .get(GameController.getAllActiveGames);

gameRoutes.route('/active/games/:id')
  .get(GameController.getActiveGame);

export default gameRoutes;
