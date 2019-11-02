import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PermissionError, AuthenticationError } from '../errors';

const saltSize = 8;
const algorithm = 'HS256';

/**
 * Permissions for admins are represented as a bitfield, this object contains
 * the bit position corresponding to the permission in the bitfield, as well
 * as a description of what the permission means.
 */
class Permission
{
  constructor(val, desc)
  {
    this.val = val;
    this.desc = desc;
  }
}

class Security
{
  // TODO this should be in the db
  permission = {
    NONE: new Permission(0, 'no permissions'),
    ALL: new Permission(1, 'all permissions'),

    C_USER: new Permission(2, 'create users'),
    R_USER: new Permission(3, 'read user info'),
    U_USER: new Permission(4, 'update users'),
    D_USER: new Permission(5, 'delete users'),

    C_GAME: new Permission(6, 'create events'),
    R_GAME: new Permission(7, 'read event info'),
    U_GAME: new Permission(8, 'update events'),
    D_GAME: new Permission(9, 'delete events'),

    C_ADMIN: new Permission(10, 'create admin'),
    R_ADMIN: new Permission(11, 'read admin info'),
    U_ADMIN: new Permission(12, 'update admins'),
    D_ADMIN: new Permission(13, 'delete admins'),

    C_ORGANIZATION: new Permission(14, 'create teams'),
    R_ORGANIZATION: new Permission(15, 'read team info'),
    U_ORGANIZATION: new Permission(16, 'update teams'),
    D_ORGANIZATION: new Permission(17, 'delete teams'),

    R_DONATION: new Permission(18, 'read donation info'),
    D_DONATION: new Permission(19, 'delete donations'),
    // no create or update
  }

  /**
   * Verifies a given token
   * @method authenticateToken
   * @param  {object}          token a jwttoken
   * @return {object}                a promise
   *                                    reject:  if token not valid
   *                                    resolve: if token is valid, return token
   */
  authenticateToken(token)
  {
    return new Promise((resolve, reject) =>
    {
      jwt.verify(token, process.env.JWT_SECRET, { algorithm },
        (err, result) => {
          return (err) ? reject(new AuthenticationError(err)) : resolve(result);
        });
    });
  }

  /**
   * Creates a token for a given user
   * @method createToken
   * @param  {User}    user a user object to create a token for
   * @return {jwt}          a signed token
   */
  createToken(user)
  {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET,
      { algorithm });
  }

  /**
   * Hash a password with bcrypt
   * @method hashPassword
   * @param  {string}     password the password to hash
   * @return {string}              the hashed password
   */
  hashPassword(password)
  {
    return bcrypt.hashSync(password, saltSize);
  }

  /**
   * Check if a password matches the stored hashed password
   * @method passwordIsValid
   * @param  {string}         guess    the password attempt
   * @param  {string}         password the stored hashed password
   * @return {boolean}                 true if the passwords match, false otherwise
   */
  passwordIsValid(guess, password)
  {
    return bcrypt.compareSync(guess, password);
  }

  /**
   * Checks if an admin has the correct permissions to perform a task
   * @method checkAdminPermissions
   * @param  {Number}              adminPerms    The permissions of the admin in quesiton
   * @param  {Number}              requestedPerm The permissions an admin is trying to use
   * @return {Boolean}                           false if either adminPerms or requestedPerms is not
   *                                             an integer
   *                                             false if the admin does not have that permission
   *                                             true if the admin has the proper permissions
   */
  checkAdminPermissions(adminPerms, requestedPerm)
  {
    return new Promise((resolve, reject) => {
      const n = requestedPerm.val - 1;
      if ((adminPerms & this.permission.ALL.val === 0b1) ||
          (((adminPerms & (1 << n)) >> n) === 0b1))
        return resolve();

      return reject(new PermissionError('Missing permission:', requestedPerm.desc));
    });
  }
}

export default new Security();
