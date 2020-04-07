import Joi from 'joi';

import { SharedValidator, Formats } from './shared.validator';

export default class GameValidator
{
  // will fail if winningTile passed with anything not === undefined
  static createGameValidator = Joi.object({
    name: Formats.name.required(),
    organizations: Formats.idArray.required(),
    startTime: Formats.date.required(),
    endTime: Formats.date.min(Joi.ref('startTime')).required(),
    winningTile: Formats.integer.allow(null).required(),
    board: Formats.integerArray.required(),
    price: Formats.integer.required(),
    streamUrl: Formats.url.required(),
  });

  static editGameValidator = Joi.object({
    _id: Formats.id,
    name: Formats.name,
    organizations: Formats.idArray,
    startTime: Formats.date,
    endTime: Formats.date,
    winningTile: Formats.any,
    board: Formats.integerArray,
    price: Formats.integer,
    streamUrl: Formats.url,
  })
    .or('name', 'organizations', 'startTime', 'endTime', 'board', 'price', 'url', 'winningTile');

  static isGameValidator = Joi.object({
    _id: Formats.id.required(),
    name: Formats.name.required(),
    organizations: Formats.any,
    startTime: Formats.date.required(),
    endTime: Formats.date.min(Joi.ref('startTime')).required(),
    winningTile: Formats.integer.allow(null).required(),
    board: Formats.integerArray.required(),
    price: Formats.integer.required(),
    streamUrl: Formats.url,
  });

  static validateCreateGame(game)
  {
    return SharedValidator.validate(game, this.createGameValidator);
  }

  static validateEditGame(game)
  {
    return SharedValidator.validate(game, this.editGameValidator);
  }

  static validateIsGame(data)
  {
    SharedValidator.validate(data, this.isGameValidator);
  }
}
