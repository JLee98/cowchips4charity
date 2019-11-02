import chai from 'chai';
import Chance from 'chance';

import Organization from '../../../src/schemas/organization.schema';
import Generator from './generator';
import OrganizationValidator from '../../../src/validators/organization.validator';

const assert = chai.assert;
const chance = new Chance();

export default class OrganizationHelper
{
  static isOrganization(data)
  {
    OrganizationValidator.validateIsOrganization(data);
  }

  static organizationsEqual(o1, o2)
  {
    assert.equal(o1.name, o2.name);
    assert.equal(o1.photo, o2.photo);
    assert.equal(o1.abbreviation, o2.abbreviation);
    assert.equal(o1.email, o2.email);
  }

  static generateInvalidOrganization(presets = {})
  {
    return {
      name: (presets.name !== undefined) ?
        presets.name : Generator.invalidName(),
      photo: (presets.photo !== undefined) ?
        presets.photo : Generator.invalidPhoto(),
      abbreviation: (presets.abbreviation !== undefined) ?
        presets.abbreviation : Generator.invalidAbbreviation(),
      email: (presets.email !== undefined) ?
        presets.email : Generator.invalidEmail(),
    };
  }

  static generateOrganization(presets = {})
  {
    return {
      name: (presets.name !== undefined) ? presets.name : Generator.name(),
      photo: (presets.photo !== undefined) ? presets.photo : Generator.photo(),
      email: (presets.email !== undefined) ? presets.email : Generator.email(),
      abbreviation: (presets.abbreviation !== undefined) ?
        presets.abbreviation : Generator.abbreviation(),
    };
  }

  static createOrganization(org)
  {
    return Organization.create(org)
      .then((createdOrg) => org._id = createdOrg._id);
  }

  static deleteOrganization(org)
  {
    return Organization.deleteOne({ name: org.name });
  }

  static setupOrganizations(num = chance.integer({ min: 10, max: 30 }))
  {
    const orgs = [];
    const promises = [];
    for (let i = 0; i < num; i++)
    {
      const org = this.generateOrganization();
      orgs.push(org);
      promises.push(this.createOrganization(org));
    }

    return Promise.all(promises)
      .then(() => Promise.resolve(orgs));
  }
}
