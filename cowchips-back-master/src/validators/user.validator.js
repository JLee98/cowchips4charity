import Joi from 'joi';
import moment from 'moment';

import { SharedValidator, Formats } from './shared.validator';

const ageRequirement = 18;
const maxAge = () => moment.utc().subtract(ageRequirement, 'years').toDate();

export default class UserValidator
{
  static createUserValidator = Joi.object({
    name: Formats.name.required(),
    password: Formats.password.required(),
    email: Formats.email.required(),
    phone: Formats.phoneNumber,
    dob: Formats.date.max(maxAge()),
    location: Formats.location,
  });

  static editUserValidator = Joi.object({
    _id: Formats.id,
    name: Formats.name,
    password: Formats.password,
    phone: Formats.phoneNumber,
    location: Formats.location,
  })
    .or('name', 'password', 'phone', 'location');

  static isUserValidator = Joi.object({
    _id: Formats.id,
    name: Formats.name.required(),
    email: Formats.email.required(),
    phone: Formats.phoneNumber.required(),
    dob: Formats.date.max(maxAge()),
    location: Formats.location,
  });

  static validateCreateUser(user)
  {
    return SharedValidator.validate(user, this.createUserValidator);
  }

  static validateEditUser(user)
  {
    return SharedValidator.validate(user, this.editUserValidator);
  }

  static validateIsUser(user)
  {
    return SharedValidator.validate(user, this.isUserValidator);
  }
}
