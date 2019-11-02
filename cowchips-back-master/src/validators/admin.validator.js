import Joi from 'joi';

import { SharedValidator, Formats } from './shared.validator';

export default class AdminValidator
{
  static createAdminValidator = Joi.object({
    name: Formats.name.required(),
    password: Formats.password.required(),
    email: Formats.email.required(),
    permissions: Formats.permissions.required(),
  });

  static editAdminValidator = Joi.object({
    _id: Formats.id,
    name: Formats.name,
    password: Formats.password,
    permissions: Formats.permissions,
  })
    .or('name', 'password', 'permissions');

  // TODO add isAdminValidator

  static validateCreateAdmin(admin)
  {
    return SharedValidator.validate(admin, this.createAdminValidator);
  }

  static validateEditAdmin(admin)
  {
    return SharedValidator.validate(admin, this.editAdminValidator);
  }
}
