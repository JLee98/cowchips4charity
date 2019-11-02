import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';

import { statusCode } from '../../src/response';
import server from '../../src/server';
import SharedHelper from './helpers/shared.helpers';
import OrganizationHelper from './helpers/organization.helpers';

import { numPagesHeaderName } from '../../src/config';

const chance = new Chance();

const assert = chai.assert;

chai.use(chaiHttp);

const numOrgs = chance.integer({ min: 10, max: 30 });
let organizations;

beforeAll(() => OrganizationHelper.setupOrganizations(numOrgs)
  .then((orgs) => organizations = orgs));
afterAll(() => SharedHelper.cleanup({ organizations })
  .then(() => mongoose.disconnect()));

describe('Organization', () => {

  describe('GET /organization', () => {

    it('it should return a list of all organizations', () =>
      chai.request(server)
        .get('/organization')
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'array');
          console.log(res.body[0]);
          OrganizationHelper.isOrganization(res.body[0]);

          return SharedHelper.assertPagingWorks(server, '/organization', res.header[numPagesHeaderName]);
        }));

  });

  describe('GET /organization/:id', () => {
    let org;

    beforeAll(() =>
      org = organizations[chance.integer({ min: 0, max: organizations.length - 1 })]);

    it('it should get the proper organization when given id', () =>
      chai.request(server)
        .get('/organization/' + org._id)
        .then((res) => {
          assert.equal(res.status, statusCode.OK);
          assert.typeOf(res.body, 'object');

          OrganizationHelper.isOrganization(res.body);
          OrganizationHelper.organizationsEqual(res.body, org);
        }));
  });
});
