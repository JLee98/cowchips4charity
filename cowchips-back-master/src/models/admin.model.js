import UserModel from './user.model';
import OrganizationModel from './organization.model';
import GameModel from './game.model';
import DonationModel from './donation.model';

import AdminValidator from '../validators/admin.validator';
import security from '../security/security';
import { pageSize, defaults } from '../config';

import {
  UserAlreadyExistsError,
  DatabaseError,
  AuthenticationError,
  ResourceNotFoundError,
} from '../errors';

import Admin from '../schemas/admin.schema';

const adminInfoFilter = '-password -__v';

export default class AdminModel
{
  /**
   * Finds a single admin that passes the filter object and applies the given
   *  projection before returning the admin object.
   *  NOTE: Does not perform permission checks, should only be used to identify
   *        the requesting admin
   * @method findOneAdmin
   * @param  {Object}  filter     An object containing the fields to match documents on
   *                              and the desired values of those fields
   * @param  {String}  projection The projection applied to the retrieved admin
   *                                    If undefined: use no projection
   * @return {Object}             An Admin object that matches the given filter and
   *                              has had the projection applied to it.
   */
  static findOneAdmin(filter, projection = '-__v')
  {
    return Admin.findOne(filter)
      .select(projection)
      .catch((err) => { throw new DatabaseError(err); });
  }

  static fetchAdmins(filter = {}, options = {})
  {
    if (options.projection === undefined)
      options.projection = defaults.projection;

    let admins = Admin.find(filter);

    if (options.page)
      admins = admins
        .skip(pageSize * (options.page - 1))
        .limit(pageSize);

    return admins.select(options.projection);
  }

  static findAdmins(requestingAdmin, filter = {}, options = {})
  {
    const requiredPerm = security.permission.R_ADMIN;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => AdminModel.fetchAdmins(filter, options))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static editAdmin(requestingAdmin, id, newData)
  {
    const requiredPerm = security.permission.U_ADMIN;

    // if admin is trying to update his/her own permissions
    if (newData.permissions !== undefined && requestingAdmin._id === id)
      return Promise.reject(new AuthenticationError('admins cannot alter their own permissions'));


    return AdminValidator.validateEditAdmin(newData)
      .then(() => {
        if (newData.password)
          newData.password = security.hashPassword(newData.password);

        // if an admin is updating themself, don't check permissions
        if (id === requestingAdmin._id)
          return this._updateAdminById(id, newData);

        // if an admin is updating another admin, check permissions
        return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
          .then(() => this._updateAdminById(id, newData));
      });
  }

  static _updateAdminById(id, newData)
  {
    return Admin.findByIdAndUpdate(id, newData, { new: true, projection: adminInfoFilter })
      .catch((err) => { throw new DatabaseError(err); });
  }

  static deleteAdminById(requestingAdmin, id)
  {
    const requiredPerm = security.permission.D_ADMIN;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => Admin.findByIdAndDelete(id))
      .catch((err) => { throw new DatabaseError(err); });
  }

  static createAdmin(requestingAdmin, admin)
  {
    const requiredPerm = security.permission.C_ADMIN;

    return AdminValidator.validateCreateAdmin(admin)
      .then(() => security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm))
      .then(() => this.findOneAdmin({ email: admin.email }))
      .then((existingAdmin) => {
        if (existingAdmin)
          throw new UserAlreadyExistsError('user already exists');
        else
        {
          const newAdmin = new Admin({
            name: admin.name,
            password: security.hashPassword(admin.password),
            email: admin.email,
            permissions: admin.permissions,
          });

          return Admin.create(newAdmin)
            .catch((err) => { throw new DatabaseError(err); });
        }
      });
  }

  static __getAdminsPageCount(filter = {})
  {
    return Admin.countDocuments(filter)
      .then((count) => Math.ceil(count / pageSize))
      .catch((err) => { throw new DatabaseError(err); });
  }

  /**
   * finds all users that fall under the given filter with the psased projection applied
   * to the returned users
   * @method findUsers
   * @param  {Object}  filter     An object containing the fields to match documents on
   *                              and the desired values of those fields
   *                                    If undefined: use an empty filter (accept all)
   * @param  {String}  projection The projection applied to the retrieved admin
   *                                    If undefined: use no projection
   * @return {Object[]}           A promise that when resolved contains a
   *                              list of all users that passed the given filter
   *                              and have the given projection applied to them.
   */
  static findUsers(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.findUsers(filter, options));
  }

  /**
   * returns the first user that passes through the given filter and applies the
   * given projection to the returned user
   * @method findOneUser
   * @param  {Object}    requestingAdmin The admin making the request
   * @param  {Object}    filter          The filter to be used on the users table
   * @param  {String}    projection      The projection to apply to the returned user
   * @return {Object}                    A promise that returns the found user when resolved
   */
  static findOneUser(requestingAdmin, filter, projection)
  {
    const requiredPerm = security.permission.R_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.findOneUser(filter, projection));
  }

  /**
   * removes a user by the given id
   * @method removeUser
   * @param  {[type]}   requestingAdmin [description]
   * @param  {[type]}   id              [description]
   * @return {[type]}                   [description]
   */
  static deleteUserById(requestingAdmin, id)
  {
    const requiredPerm = security.permission.D_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.deleteUserById(id));
  }

  static editUser(requestingAdmin, id, newData)
  {
    const requiredPerm = security.permission.U_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.editUser(id, newData));
  }

  /**
   * Saves the given user to the database
   * @method createUser
   * @param  {User}    user The user object to store in the database
   * @return {Promise}      A promise that is resolved after the user has been
   *                        written to the database
   */
  static createUser(requestingAdmin, user)
  {
    const requiredPerm = security.permission.C_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.createUser(user));
  }

  static __getUsersPageCount(filter)
  {
    return UserModel.__getUsersPageCount(filter);
  }

  static findOneOrganization(requestingAdmin, filter, projection)
  {
    const requiredPerm = security.permission.R_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.findOneOrganization(filter, projection));
  }

  static findOrganizations(requestingAdmin, filter, options = {})
  {
    const requiredPerm = security.permission.R_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.findOrganizations(filter, options));
  }

  static createOrganization(requestingAdmin, organization)
  {
    const requiredPerm = security.permission.C_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.createOrganization(organization));
  }

  static deleteOrganizationById(requestingAdmin, id)
  {
    const requiredPerm = security.permission.D_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.deleteOrganizationById(id));
  }

  static editOrganization(requestingAdmin, id, update)
  {
    const requiredPerm = security.permission.U_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.editOrganization(id, update));
  }

  static __getOrganizationsPageCount(filter)
  {
    return OrganizationModel.__getOrganizationsPageCount(filter);
  }

  static findGames(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.findGames(filter, options));
  }

  static findOneGame(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.findOneGame(filter, options));
  }

  static createGame(requestingAdmin, game)
  {
    const requiredPerm = security.permission.C_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.createGame(game));
  }

  static editGame(requestingAdmin, id, update)
  {
    const requiredPerm = security.permission.U_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.editGame(id, update));
  }

  static deleteGameById(requestingAdmin, id)
  {
    const requiredPerm = security.permission.D_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.deleteGameById(id));
  }

  static findActiveGames(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.findActiveGames(filter, options));
  }

  static findOneActiveGame(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.findOneActiveGame(filter, options));
  }

  static getGameWinners(requestingAdmin, gameID)
  {
    const requiredPerm = security.permission.R_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.findOneGame({ _id: gameID }))
      .then((game) => {
        if (game == undefined || game == null)
          throw new ResourceNotFoundError('That game is not finished or does not exist');

        if (game.winningTile === null)
          throw new ResourceNotFoundError('The winners have not yet been selected for that game');

        return game;
      })
      .then((game) => DonationModel.getWinnersOfGame(game._id, game.winningTile));
  }

  static setWinningTile(requestingAdmin, gameID, tile)
  {
    const requiredPerm = security.permission.U_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.setWinningTile(gameID, tile));
  }

  static __getGamesPageCount(filter)
  {
    return GameModel.__getGamesPageCount(filter);
  }

  static __getActiveGamesPageCount(filter)
  {
    return GameModel.__getActiveGamesPageCount(filter);
  }

  static findDonations(requestingAdmin, filter, projection)
  {
    const requiredPerm = security.permission.R_DONATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => DonationModel.findDonations(filter, projection));
  }

  static findOneDonation(requestingAdmin, filter, projection)
  {
    const requiredPerm = security.permission.R_DONATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => DonationModel.findOneDonation(filter, projection));
  }

  static deleteDonationById(requestingAdmin, id)
  {
    const requiredPerm = security.permission.D_DONATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => DonationModel.deleteDonationById(id));
  }

  static __getDonationsPageCount(filter)
  {
    return DonationModel.__getDonationsPageCount(filter);
  }

  static searchUsers(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_USER;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => UserModel.searchUsers(filter, options));
  }

  static searchAdmins(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_ADMIN;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => AdminModel.fetchAdmins(filter, options));
  }

  static searchOrganizations(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_ORGANIZATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => OrganizationModel.searchOrganizations(filter, options));
  }

  static searchGames(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.searchGames(filter, options));
  }

  static searchActiveGames(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_GAME;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => GameModel.searchActiveGames(filter, options));
  }

  static searchDonations(requestingAdmin, filter, options)
  {
    const requiredPerm = security.permission.R_DONATION;

    return security.checkAdminPermissions(requestingAdmin.permissions, requiredPerm)
      .then(() => DonationModel.searchDonations(filter, options));
  }
}
