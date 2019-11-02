import chai from 'chai';
import moment from 'moment';

import { statusCode } from '../../../src/response';

import UserHelper from './user.helpers';
import AdminHelper from './admin.helpers';
import OrganizationHelper from './organization.helpers';
import DonationHelper from './donation.helpers';
import GameHelper from './game.helpers';

const assert = chai.assert;

export default class SharedHelper
{
  /**
   * Asserts a login was successful
   *  Expects: { status: 200, body: { data: { auth: true, token: string }}}
   * @method loginSuccessful
   * @param  {Object}        res The response object from the server
   */
  static loginSuccessful(res)
  {
    assert.equal(res.status, statusCode.OK, 'status is 200');
    assert.typeOf(res.body, 'object', 'res is an object');
    assert.property(res.body, 'auth', 'res has auth');
    assert.property(res.body, 'token', 'res has token');
    assert.equal(res.body.auth, true, 'auth is true');
    assert.typeOf(res.body.token, 'string', 'token is string');
  }

  /**
   * Asserts a login was unsuccessful
   * Expects: { status: 401, body: { data: { auth: false,
   *            error: 'incorrect username and/or password' }}}
   * @method loginFailed
   * @param  {Object}        res The response object from the server
   */
  static loginFailed(res)
  {
    assert.equal(res.status, statusCode.UNAUTHORIZED, 'status is 401');
    assert.typeOf(res.body, 'object', 'res is an object');
    assert.property(res.body, 'auth', 'res has auth');
    assert.property(res.body, 'error', 'res has error');
    assert.equal(res.body.auth, false, 'auth is false');
    assert.equal(res.body.error, 'incorrect username and/or password');
  }

  static copy(obj)
  {
    const ret = {};
    const props = Object.getOwnPropertyNames(obj);
    for (const i in props)
      ret[props[i]] = obj[props[i]];

    return ret;
  }

  static badRequest(res)
  {
    assert.equal(res.status, statusCode.BAD_REQUEST);
    assert.typeOf(res.body, 'object');
    assert.property(res.body, 'auth');
    assert.property(res.body, 'error');
    assert.equal(res.body.auth, false);
  }


  static assertDatesEqual(d1, d2)
  {
    const m1 = moment.utc(d1);
    const m2 = moment.utc(d2);

    assert.equal(m1.diff(m2), 0);
  }

  static initDB()
  {

  }

  static setup(objs = {})
  {
    const promises = [];
    if (objs.users !== undefined)
      for (let i = 0; i < objs.users.length; i++)
        promises.push(UserHelper.createUser(objs.users[i])
          .then((u) => objs.users[i]._id = u._id));
    if (objs.admins !== undefined)
      for (let i = 0; i < objs.admins.length; i++)
        promises.push(AdminHelper.createAdmin(objs.admins[i])
          .then((a) => objs.admins[i]._id = a._id));
    if (objs.organizations !== undefined)
      for (let i = 0; i < objs.organizations.length; i++)
        promises.push(OrganizationHelper.createOrganization(objs.organizations[i])
          .then((o) => objs.organizations[i]._id = o._id));
    if (objs.games !== undefined)
      for (let i = 0; i < objs.games.length; i++)
        promises.push(GameHelper.createGame(objs.games[i])
          .then((g) => objs.games[i]._id = g._id));
    if (objs.donations !== undefined)
      for (let i = 0; i < objs.donations.length; i++)
        promises.push(DonationHelper.createDonation(objs.donations[i])
          .then((d) => objs.donations[i]._id = d._id));

    return Promise.all(promises);
  }

  static cleanup(objs = {})
  {
    const promises = [];

    if (objs.users !== undefined)
      for (let i = 0; i < objs.users.length; i++)
        promises.push(UserHelper.deleteUser(objs.users[i]));
    if (objs.admins !== undefined)
      for (let i = 0; i < objs.admins.length; i++)
        promises.push(AdminHelper.deleteAdmin(objs.admins[i]));
    if (objs.organizations !== undefined)
      for (let i = 0; i < objs.organizations.length; i++)
        promises.push(OrganizationHelper.deleteOrganization(objs.organizations[i]));
    if (objs.donations !== undefined)
      for (let i = 0; i < objs.donations.length; i++)
        promises.push(DonationHelper.deleteDonation(objs.donations[i]));
    if (objs.games !== undefined)
      for (let i = 0; i < objs.games.length; i++)
        promises.push(GameHelper.deleteGame(objs.games[i]));

    return Promise.all(promises);
  }

  static contains(array, obj,
    comparator = (o1, o2) => o1._id === o2._id)
  {
    let has = false;
    for (let i = 0; i < array.length; i++)
    {
      if (comparator(array[i], obj))
      {
        has = true;
        break;
      }
    }

    return has;
  }

  static assertPagingWorks(server, route, maxPages, loginToken = 'undefined')
  {
    if (maxPages == 0)
      return;
    return chai.request(server)
      .get(route + '?page=' + maxPages)
      .set('Authorization', loginToken)
      .then((res) => {
        assert.equal(res.status, statusCode.OK);
        assert.typeOf(res.body, 'array');
        assert.isAbove(res.body.length, 0);
      })
      .then(() => chai.request(server)
        .get(route + '?page=' + (maxPages + 1))
        .set('Authorization', loginToken)
        .then((r) => {
          assert.equal(r.status, statusCode.RESOURCE_NOT_FOUND);
        }));
  }

  static assertArraysEqual(a1, a2)
  {
    assert.equal(a1.length, a2.length);
    for (let i = 0; i < a1.length; i++)
      assert.equal(a1[i], a2[i]);
  }
}
