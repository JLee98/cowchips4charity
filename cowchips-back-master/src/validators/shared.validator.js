import Joi from 'joi';

import { BadRequestError, ValidationError } from '../errors';

// phone formats:
// * 3 digits (possibly surrounded by parentheses) followed by
// * '-', '.', ' ', or '' followed by
// * 3 digits
// * '-', '.', ' ', or '' followed by
// 4 digits
const phoneRegex = /^\d{10}$/;

// jpg formats: ends in .jpg
const endsInJpgRegex = /^.*\.jpg$/;

// no spaces format: no spaces allowed in the string
const noSpacesRegex = /^[^ ]*[^ ]$/;

// only 5 digits, or 5 digits followed by a hyphen and 4 digits
const zipRegex = /^\d{5}(-\d{4})?$/;

class Formats
{
  static email = Joi.string().email();
  static password = Joi.string();
  static name = Joi.string();
  static date = Joi.date();

  static id = Joi.alternatives().try(Joi.string(), Joi.object());
  static idArray = Joi.array().items(Formats.id);

  static permissions = Joi.number().positive();
  static phoneNumber = Joi.string().regex(phoneRegex);
  static photo = Joi.string().regex(endsInJpgRegex);
  static abbreviation = Joi.string().regex(noSpacesRegex);
  static url = Joi.string();

  static boolean = Joi.boolean();
  static integer = Joi.number().integer();
  static integerArray = Joi.array().items(Formats.integer);

  static address = Joi.string(); // should we use some regex for this? e.g. <numb> <street>?
  static zip = Joi.string().regex(zipRegex);
  static state = Joi.string();
  static city = Joi.string();
  static emptyObject = Joi.object({});
  static location = Joi.alternatives().try(Joi.object({
    address: Formats.address.required(),
    zip: Formats.zip.required(),
    state: Formats.state.required(),
    city: Formats.city.required(),
  }), Formats.emptyObject);

  static currency = Joi.string();
  static stripeSource = Joi.string();
  static stripeID = Joi.string();
  static any = Joi.any();
}

export default class SharedValidator
{
  static loginValidator = Joi.object({
    email: Formats.email.required(),
    password: Formats.password.required(),
  });

  static validateLogin(creds)
  {
    return this.validate(creds, this.loginValidator);
  }

  static validate(data, validator)
  {
    return new Promise((resolve, reject) =>
      Joi.validate(data, validator, (err, validatedData) =>
        ((err) ? reject(new ValidationError(err)) : resolve(validatedData))));
  }
}

export { SharedValidator, Formats };
