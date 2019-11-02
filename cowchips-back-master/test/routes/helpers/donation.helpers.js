import chai from 'chai';
import Chance from 'chance';

import SharedHelper from './shared.helpers';
import Donation from '../../../src/schemas/donation.schema';
import Generator from './generator';
import DonationValidator from '../../../src/validators/donation.validator';
import UserValidator from '../../../src/validators/user.validator';
import OrganizationValidator from '../../../src/validators/organization.validator';
import GameValidator from '../../../src/validators/game.validator';

const assert = chai.assert;
const chance = new Chance();

export default class DonationHelper
{
  static isDonation(data)
  {
    return DonationValidator.validateIsDonation(data);
  }

  static donationsEqual(o1, o2)
  {
    assert.equal(o1.amount, o2.amount);
    // assert.equal(o1.userID._id, o2.userID);
    // assert.equal(o1.organizationID._id, o2.organizationID);
    // assert.equal(o1.gameID._id, o2.gameID);
    assert.equal(o1.stripeID, o2.stripeID);
    SharedHelper.assertDatesEqual(o1.date, o2.date);
    SharedHelper.assertArraysEqual(o1.tiles, o2.tiles);
  }

  static generateDonation(user, org, game, presets = {})
  {
    const tiles = Generator.tiles(game.board);
    return {
      userID: user._id,
      organizationID: org._id,
      gameID: game._id,
      amount: (presets.amount !== undefined) ? presets.amount : game.price * tiles.length,
      date: (presets.date !== undefined) ? presets.date : Generator.date(),
      stripeID: (presets.stripeID !== undefined) ? presets.stripeID : Generator.stripeID(),
      tiles,
    };
  }

  static generateStripePayment(games)
  {
    if (games !== undefined)
    {
      const game = chance.pickone(games);
      const tiles = chance.pickset(game.board);

      return {
        amount: tiles.length * game.price,
        currency: 'usd',
        source: 'tok_visa', // randomize this?
        organizationID: chance.pickone(game.organizations)._id,
        gameID: game._id,
        date: new Date(),
        tiles,
      };
    }

    return {
      amount: chance.integer({ min: 50, max: 100 }),
      currency: 'usd',
      source: 'tok_visa',
      date: new Date(),
    };
  }

  static createDonation(donation)
  {
    return Donation.create(donation)
      .then((createdDonation) => donation._id = createdDonation._id);
  }

  static deleteDonation(donation)
  {
    return Donation.deleteOne({ _id: donation._id });
  }

  static deleteDonationsForUser(user)
  {
    return Donation.deleteMany({ userID: user._id });
  }

  static setupDonations(orgs, games, users, amount = chance.integer({ min: 10, max: 30 }))
  {
    const promises = [];
    const donations = [];
    for (let i = 0; i < amount; i++)
    {
      const user = chance.pickone(users);
      const org = chance.pickone(orgs);
      const game = chance.pickone(games);
      const donation = this.generateDonation(user, org, game);
      donations.push(donation);
      promises.push(this.createDonation(donation));
    }
    return Promise.all(promises)
      .then(() => Promise.resolve(donations));
  }

  static confirmPopulated(donation)
  {
    return UserValidator.validateIsUser(donation.userID) &&
      OrganizationValidator.validateIsOrganization(donation.organizationID) &&
      GameValidator.validateIsGame(donation.gameID);
  }

  static assertIsPopulated(donation)
  {
    const checks = [];

    checks.push(UserValidator.validateIsUser(donation.userID));

    // since orgID and gameID are not required, only check if they exist
    if (donation.organizationID !== undefined)
      checks.push(OrganizationValidator.validateIsOrganization(donation.organizationID));
    if (donation.gameID !== undefined)
      checks.push(GameValidator.validateIsGame(donation.gameID));

    return Promise.all(checks)
      .catch((err) => { throw err; });
  }

  static assertIsNotPopulated(donation)
  {
    assert.typeOf(donation.userID, 'string');

    if (donation.organizationID !== undefined)
      assert.typeOf(donation.organizationID, 'string');
    if (donation.gameID !== undefined)
      assert.typeOf(donation.gameID, 'string');
  }
}
