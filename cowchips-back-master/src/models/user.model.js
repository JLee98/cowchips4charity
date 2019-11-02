import { UserAlreadyExistsError, DatabaseError } from '../errors';
import { pageSize } from '../config';
import UserValidator from '../validators/user.validator';
import security from '../security/security';

import User from '../schemas/user.schema';

const userInfoFilter = '-password -__v';

export default class UserModel
{
  /**
   * Find a user with the given filter and apply the given projection
   * @method findOneUser
   * @param  {object} filter     the filter to apply -- pass an object with the
   *                             desired attributes of the User being searched for
   * @param  {string} projection the project, which decides what attributes from
   *                             the stored object are returned from the db
   * @return {User}              the user object matching the filter with the given
   *                             projection applied. Null if does not exist
   */
  static findOneUser(filter, projection = '-__v')
  {
    return User.findOne(filter)
      .select(projection)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static findUsers(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = '-__v';

    let users = User.find(filter);

    if (options.page)
      users = users
        .skip(pageSize * (options.page - 1))
        .limit(pageSize);

    return users
      .select(options.projection)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static deleteUserById(id)
  {
    return User.findByIdAndDelete(id)
      .catch((err) => { throw new DatabaseError(err); });
  }

  /**
   * Saves the given user to the database
   * @method createUser
   * @param  {User}    user The user object to store in the database
   * @return {Promise}      A promise that is resolved after the user has been
   *                        written to the database
   */
  static createUser(user)
  {
    return UserValidator.validateCreateUser(user)
      .then(() => this.findOneUser({ email: user.email }))
      .then((existingUser) => {
        if (existingUser)
          throw new UserAlreadyExistsError('user already exists');
        else
        {
          user.password = security.hashPassword(user.password);
          return User.create(user)
            .catch((err) => { throw new DatabaseError(err); });
        }
      });
  }

  /**
   * Updates the user with the given id
   * @method editUser
   * @param  {string} id      id of the user to update
   * @param  {object} newData object containing the fields to update
   * @return {object}         the updated user if successful, otherwise null
   */
  static editUser(id, newData)
  {
    return UserValidator.validateEditUser(newData)
      .then(() => {
        if (newData.password !== undefined)
          newData.password = security.hashPassword(newData.password);

        return User.findByIdAndUpdate(id, newData, { new: true, projection: userInfoFilter })
          .catch((err) => { throw new DatabaseError(err); });
      });
  }

  static __getUsersPageCount(filter = {})
  {
    return User.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static searchUsers(filter, options)
  {
    return UserModel.findUsers(filter, options);
  }
}
