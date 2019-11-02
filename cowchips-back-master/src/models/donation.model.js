import { DatabaseError } from '../errors';
import Donation from '../schemas/donation.schema';
import { pageSize, defaults } from '../config';
import DonationValidator from '../validators/donation.validator';

export default class DonationModel
{
  static fetchDonations(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.populate === undefined)
      options.populate = defaults.populate;

    let donations = Donation.find(filter);

    if (options.page)
      donations = donations
        .skip(pageSize * (options.page - 1))
        .limit(pageSize);

    donations = donations.select(options.projection);

    if (!options.populate)
      return donations;

    return DonationModel.populate(donations);
  }

  static findDonations(filter = {}, options = {})
  {
    return DonationModel.fetchDonations(filter, options)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static findOneDonation(filter, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;
    if (options.populate === undefined)
      options.populate = defaults.populate;

    const donation = Donation.findOne(filter)
      .select(options.projection);

    if (!options.populate)
      return donation;

    return DonationModel.populate(donation);
  }

  static createDonation(donation)
  {
    return DonationValidator.validateCreateDonation(donation)
      .then(() => Donation.create(donation)
        .catch((err) => { throw new DatabaseError(err); }))
      .catch((err) => console.error(err));
  }

  static deleteDonationById(id)
  {
    return Donation.findByIdAndDelete(id)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static __getDonationsPageCount(filter = {})
  {
    return Donation.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static populate(d, filter = undefined)
  {
    const populators = {};
    populators.organizationID = { path: 'organizationID', select: defaults.projection };
    populators.gameID = { path: 'gameID', select: defaults.projection };
    populators.userID = { path: 'userID', select: defaults.userProjection };

    if (filter !== undefined)
      populators[filter.path].match = filter.match;

    return d.populate(populators.organizationID)
      .populate(populators.gameID)
      .populate(populators.userID)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static getWinnersOfGame(id, winningTile)
  {
    // queries for donations made to a specific game and that contain the winningTile
    return DonationModel.populate(Donation.find({ gameID: id, tiles: winningTile }));
  }

  static searchDonations(filter, options)
  {
    if (filter.path === undefined)
      return DonationModel.findDonations(filter, options);
    else
    {
      const donations = DonationModel.fetchDonations({}, { page: options.page });
      return DonationModel.populate(donations, filter)
        .then((populated) => populated.filter(d => d[filter.path]))
        .catch((err) => { throw new DatabaseError(err); });
    }
  }
}
