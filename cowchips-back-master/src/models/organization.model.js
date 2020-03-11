import { DatabaseError } from '../errors';
import { pageSize } from '../config';
import Organization from '../schemas/organization.schema';
import OrganizationValidator from '../validators/organization.validator';

export default class OrganizationModel
{
  static findOrganizations(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = '-__v';

    let organizations = Organization.find(filter);

    if (options.page)
      organizations = organizations
        .skip(pageSize * (options.page - 1))
        .limit(pageSize);

    return organizations
      .select(options.projection)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static findOneOrganization(filter, projection = '-__v')
  {
    return Organization.findOne(filter)
      .select(projection)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static createOrganization(organization)
  {
    return OrganizationValidator.validateCreateOrganization(organization)
      .then(() => Organization.create(organization)
        .catch((err) => { throw new DatabaseError(err); }));
  }

  static deleteOrganizationById(id)
  {
    return Organization.findByIdAndDelete(id)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static editOrganization(id, update)
  {
    return OrganizationValidator.validateEditOrganization(update)
      .then(() => Organization.findByIdAndUpdate(id, update, { new: true, projection: '-__v' })
        .catch((err) => { throw new DatabaseError(err); }));
  }

  static __getOrganizationsPageCount(filter = {})
  {
    return Organization.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static searchOrganizations(filter, options)
  {
    return OrganizationModel.findOrganizations(filter, options);
  }
}
