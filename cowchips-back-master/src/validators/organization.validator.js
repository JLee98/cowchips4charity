import Joi from 'joi';

import { SharedValidator, Formats } from './shared.validator';

export default class OrganizationValidator
{
  static createOrganizationValidator = Joi.object({
    name: Formats.name.required(),
    photo: Formats.photo,
    abbreviation: Formats.abbreviation.required(),
    email: Formats.email,
  });

  static editOrganizationValidator = Joi.object({
    _id: Formats.id,
    name: Formats.name,
    photo: Formats.photo,
    abbreviation: Formats.abbreviation,
    email: Formats.email,
  })
    .or('name', 'photo', 'abbreviation', 'email');

  static isOrganizationValidator = Joi.object({
    _id: Formats.id.required(),
    name: Formats.name.required(),
    photo: Formats.photo,
    abbreviation: Formats.abbreviation.required(),
    email: Formats.email,
  });

  static validateCreateOrganization(org)
  {
    return SharedValidator.validate(org, this.createOrganizationValidator);
  }

  static validateEditOrganization(org)
  {
    return SharedValidator.validate(org, this.editOrganizationValidator);
  }

  static validateIsOrganization(org)
  {
    return SharedValidator.validate(org, this.isOrganizationValidator);
  }
}
