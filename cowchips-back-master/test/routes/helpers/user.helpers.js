import chai from 'chai';
import Chance from 'chance';

import server from '../../../src/server';
import { statusCode } from '../../../src/response';
import security from '../../../src/security/security';
import User from '../../../src/schemas/user.schema';
import Generator from './generator';
import UserValidator from '../../../src/validators/user.validator';
import SharedHelper from './shared.helpers';

const assert = chai.assert;
const chance = new Chance();

export default class UserHelper
{
  /**
   * Asserts a register was successful
   *  Expects: { status: 200, body: { data: { auth: true, token: string }}}
   * @method registerSuccessful
   * @param  {Object}        res The response object from the server
   */
  static registerSuccessful(res)
  {
    assert.equal(res.status, statusCode.OK, 'status is 200');
    assert.typeOf(res.body, 'object', 'res is an object');
    assert.property(res.body, 'auth', 'res has auth');
    assert.property(res.body, 'token', 'res has token');
    assert.equal(res.body.auth, true, 'auth is true');
    assert.typeOf(res.body.token, 'string', 'token is string');
  }

  /**
   * Asserts a user already exists
   *  Expects: { status: 401, body: { data: { auth: false, token: 'user already exists' }}}
   * @method loginSuccessful
   * @param  {Object}        res The response object from the server
   */
  static userAlreadyExists(res)
  {
    assert.equal(res.status, statusCode.UNAUTHORIZED);
    assert.typeOf(res.body, 'object', 'res is an object');
    assert.property(res.body, 'auth', 'res has auth');
    assert.property(res.body, 'error', 'res has error');
    assert.equal(res.body.auth, false, 'auth is fale');
    assert.equal(res.body.error, 'user already exists');
  }

  /**
   * Checks if a variable is a User object
   *  Expects: { name: string, email: string, phone: string, donations: object[], _id: string }
   * @method loginSuccessful
   * @param  {Object}        data The variable to check
   */
  static isUser(data)
  {
    UserValidator.validateIsUser(data);
  }

  /**
   * Checks if two user objects are the same
   * @method usersEqual
   * @param  {Object}   u1 One of the users to compare
   * @param  {Object}   u2 The other user to compare
   */
  static usersEqual(u1, u2)
  {
    assert.equal(u1.name, u2.name);
    assert.equal(u1.email, u2.email);
    assert.equal(u1.phone, u2.phone);
    SharedHelper.assertDatesEqual(u1.dob, u2.dob);
  }

  static userLogin(user)
  {
    const creds = {
      email: user.email,
      password: user.password,
    };
    return chai.request(server)
      .post('/login')
      .send(creds);
  }

  static generateInvalidUser(presets = {})
  {
    return {
      name: (presets.name !== undefined) ?
        presets.name : Generator.invalidName(),
      email: (presets.email !== undefined) ?
        presets.email : Generator.invalidEmail(),
      password: (presets.password !== undefined) ?
        presets.password : Generator.invalidPassword(),
      phone: (presets.phone !== undefined) ?
        presets.phone : Generator.invalidPhone(),
      dob: (presets.phone !== undefined) ?
        presets.phone : Generator.invalidDate(),
      location: (presets.location !== undefined) ?
        presets.location : Generator.invalidLocation(),
    };
  }

  static generateUser(presets = {})
  {
    return {
      name: (presets.name !== undefined) ? presets.name : Generator.name(),
      email: (presets.email !== undefined) ? presets.email : Generator.email(),
      password: (presets.password !== undefined) ? presets.password : Generator.password(),
      phone: (presets.phone !== undefined) ? presets.phone : Generator.phone(),
      dob: (presets.dob !== undefined) ?
        presets.dob : Generator.dob(),
      location: (presets.location !== undefined) ?
        presets.location : Generator.location(),
    };
  }

  static copyUser(user)
  {
    const location = {
      address: user.location.address,
      zip: user.location.zip,
      state: user.location.state,
      city: user.location.city,
    };
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
      dob: user.dob,
      location,
    };
  }

  static createUser(user)
  {
    const u = this.copyUser(user);
    u.password = security.hashPassword(user.password);
    return User.create(u)
      .then((createdUser) => user._id = createdUser._id);
  }

  static deleteUser(user)
  {
    return User.deleteOne({ email: user.email });
  }

  static setupUsers(num = chance.integer({ min: 20, max: 30 }))
  {
    const users = [];
    const promises = [];
    for (let i = 0; i < num; i++)
    {
      const user = this.generateUser();
      users.push(user);
      promises.push(this.createUser(user));
    }

    return Promise.all(promises)
      .then(() => Promise.resolve(users));
  }
}
