import chai from 'chai';
import Chance from 'chance';

import server from '../../../src/server';
import { statusCode } from '../../../src/response';
import security from '../../../src/security/security';
import Admin from '../../../src/schemas/admin.schema';
import SharedHelper from './shared.helpers';
import Generator from './generator';

const assert = chai.assert;
const chance = new Chance();

export default class AdminHelper
{
  /**
   * Checks if a variable is an Admin object
   * @method isAdmin
   * @param  {Object}  data The variable to check
   */
  static isAdmin(data)
  {
    assert.typeOf(data, 'object');
    assert.property(data, 'name');
    assert.property(data, 'permissions');
    assert.property(data, 'email');
    assert.property(data, '_id');

    assert.typeOf(data._id, 'string');
    assert.typeOf(data.name, 'string');
    assert.typeOf(data.email, 'string');
    assert.typeOf(data.permissions, 'number');

    assert.notProperty(data, 'password');
  }

  /**
   * Checks if two admin objects are equal
   * @method adminsEqual
   * @param  {Object}    a1 One of the admins to compare
   * @param  {Object}    a2 The other admin to compare
   */
  static adminsEqual(a1, a2)
  {
    assert.equal(a1.name, a2.name);
    assert.equal(a1.email, a2.email);
    assert.equal(a1.permissions, a2.permissions);
  }

  /**
   * Login an admin
   * @method adminLogin
   * @param  {Object}   admin The admin's credentials, i.e. email and password
   * @return {Promise}        The promise created from chai.request
   */
  static adminLogin(admin)
  {
    const creds = {
      email: admin.email,
      password: admin.password,
    };
    return chai.request(server)
      .post('/admin/login')
      .send(creds);
  }

  static generateAdmin(presets = {})
  {
    return {
      name: (presets.name !== undefined) ? presets.name : Generator.name(),
      email: (presets.email !== undefined) ? presets.email : Generator.email(),
      password: (presets.password !== undefined) ? presets.password : Generator.password(),
      permissions: (presets.permissions !== undefined) ?
        presets.permissions : Generator.permission(),
    };
  }

  static generateInvalidAdmin(presets = {})
  {
    return {
      name: (presets.name !== undefined) ?
        presets.name : Generator.invalidName(),
      email: (presets.email !== undefined) ?
        presets.email : Generator.invalidEmail(),
      password: (presets.password !== undefined) ?
        presets.password : Generator.invalidPassword(),
      permissions: (presets.permissions !== undefined) ?
        presets.permissions : Generator.invalidPermissions(),
    };
  }

  static setupAdmins(num = chance.integer({ min: 10, max: 30 }))
  {
    const admins = [];
    const promises = [];
    for (let i = 0; i < num; i++)
    {
      const admin = this.generateAdmin();
      admins.push(admin);
      promises.push(this.createAdmin(admin));
    }

    return Promise.all(promises)
      .then(() => Promise.resolve(admins));
  }

  static createAdmin(admin)
  {
    const a = SharedHelper.copy(admin);
    a.password = security.hashPassword(admin.password);
    return Admin.create(a);
  }

  static deleteAdmin(admin)
  {
    return Admin.deleteOne({ email: admin.email });
  }
}
