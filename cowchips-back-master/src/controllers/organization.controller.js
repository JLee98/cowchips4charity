import OrganizationModel from '../models/organization.model';
import { error } from '../response';
import { numPagesHeaderName } from '../config';
import { ResourceNotFoundError } from '../errors';

export default class OrganizationController
{
  static getOrganization(req, res)
  {
    OrganizationModel.findOneOrganization({ _id: req.params.id })
      .then((organization) => res.json(organization))
      .catch((err) => error(res, err));
  }

  static getAllOrganizations(req, res)
  {
    const page = (req.query.page !== undefined) ? req.query.page : 1;
    const filter = req.body;
    OrganizationModel.findOrganizations(filter, { page })
      .then((organizations) => OrganizationModel.__getOrganizationsPageCount(filter)
        .then((count) => {
          if (page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(organizations);
        }))
      .catch((err) => error(res, err));
  }
}
