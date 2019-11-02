import Joi from 'joi';

import { SharedValidator, Formats } from './shared.validator';

export default class DonationValidator
{
  static makeDonationValidator = Joi.object({
    amount: Formats.integer.required(),
    currency: Formats.currency.required(),
    source: Formats.stripeSource.required(),
    organizationID: Formats.id,
    gameID: Formats.id,
    date: Formats.date.required(), // should this be recorded by the server or the client?
    tiles: Formats.integerArray,
  });

  static createDonationValidator = Joi.object({
    amount: Formats.integer.required(),
    userID: Formats.id.required(),
    organizationID: Formats.id,
    gameID: Formats.id,
    stripeID: Formats.stripeID.required(),
    date: Formats.date.required(),
    tiles: Formats.integerArray,
  });

  static isDonationValidator = Joi.object({
    _id: Formats.id.required(),
    amount: Formats.integer.required(),
    userID: Joi.any(),
    organizationID: Joi.any(),
    gameID: Joi.any(),
    stripeID: Formats.stripeID.required(),
    date: Formats.date.required(),
    tiles: Formats.integerArray.required(),
  });

  static validateMakeDonation(donation)
  {
    return SharedValidator.validate(donation, this.makeDonationValidator);
  }

  static validateCreateDonation(donation)
  {
    return SharedValidator.validate(donation, this.createDonationValidator);
  }

  static validateIsDonation(donation)
  {
    return SharedValidator.validate(donation, this.isDonationValidator);
  }
}
