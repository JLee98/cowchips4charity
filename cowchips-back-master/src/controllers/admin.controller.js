import moment from 'moment';

import {
  IncorrectUsernamePasswordError,
  ResourceNotFoundError,
} from '../errors';

import Mailer from '../mailing/mailer';
import { error } from '../response';
import security from '../security/security';
import AdminModel from '../models/admin.model';
import UserModel from '../models/user.model';
import SharedValidator from '../validators/shared.validator';

import {
  numPagesHeaderName,
  winningTemplateName,
  winningTemplateNeedLocationName,
} from '../config';


const userInfoFilter = '-password -__v';
const adminInfoFilter = '-password -__v';

export default class AdminController
{
  /**
   * Logins an existing admin
   * @method login
   * @param  {Object} req The message sent by the browser
   *                      { body: { email: String, password: String } }
   * @param  {Object} res The message sent back to the client from the server
   *                            Success: { auth: true, token: jwt }
   *                            Failure: { auth: false, err: String }
   */
  static login(req, res)
  {
    return SharedValidator.validateLogin(req.body)
      .then(() => AdminModel.findOneAdmin({ email: req.body.email }))
      .then((admin) => {
        if (!admin || !security.passwordIsValid(req.body.password, admin.password))
          throw new IncorrectUsernamePasswordError('incorrect username and/or password');
        else
          res.json({
            auth: true,
            token: security.createToken(admin),
          });
      })
      .catch((err) => error(res, err));
  }

  static getAccount(req, res)
  {
    const admin = res.locals.admin.toObject();
    delete admin.password;
    return res.json(admin);
  }

  static updateAccount(req, res)
  {
    AdminModel.editAdmin(res.locals.admin, res.locals.admin._id, req.body)
      .then((updatedAdmin) => res.json(updatedAdmin))
      .catch((err) => error(res, err));
  }

  static getAllAdmins(req, res)
  {
    const page = req.query.page;
    AdminModel.findAdmins(res.locals.admin, {}, { projection: adminInfoFilter, page })
      .then((admins) =>
        AdminModel.__getAdminsPageCount()
          .then((count) => {
            if (page !== undefined && page != 1 && page > count)
              return error(res, new ResourceNotFoundError(' page not found'));
            res.set(numPagesHeaderName, count);
            return res.json(admins);
          }))
      .catch((err) => error(res, err));
  }

  static getAdmin(req, res)
  {
    const requiredPerm = security.permission.R_ADMIN;

    security.checkAdminPermissions(res.locals.admin.permissions, requiredPerm)
      .then(() => AdminModel.findOneAdmin({ _id: req.params.id }, adminInfoFilter))
      .then((admin) => res.json(admin))
      .catch((err) => error(res, err));
  }

  static addAdmin(req, res)
  {
    AdminModel.createAdmin(res.locals.admin, req.body)
      .then((addedAdmin) =>
        new Mailer().verifyEmail(addedAdmin.email)
          .then(() => addedAdmin))
      .then((addedAdmin) => {
        addedAdmin = addedAdmin.toObject();
        delete addedAdmin.password;
        delete addedAdmin.__v;
        return res.json(addedAdmin);
      })
      .catch((err) => error(res, err));
  }

  static updateAdmin(req, res)
  {
    AdminModel.editAdmin(res.locals.admin, req.params.id, req.body)
      .then((updatedAdmin) => res.json(updatedAdmin))
      .catch((err) => error(res, err));
  }

  static deleteAdmin(req, res)
  {
    AdminModel.findOneAdmin({ _id: req.params.id })
      .then((admin) => AdminModel.deleteAdminById(res.locals.admin, req.params.id)
        .then(() => admin))
      .then((admin) => new Mailer().deleteEmail(admin.email))
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  /**
   * Retrieves a list of all users after performing security checks to ensure that
   * the user has the proper security to do so.
   * @method getAllUsers
   * @param  {Object}    req The message sent by the browser
   *                         { cookies: { authToken: string } }
   * @param  {[type]}    res The message sent back to the client from the server
   *                              Success: { users: Object[] }
   *                              Failure: { auth: false, error: string }
   */
  static getAllUsers(req, res)
  {
    const page = req.query.page;
    const filter = req.body;
    AdminModel.findUsers(res.locals.admin, filter, { projection: userInfoFilter, page })
      .then((users) => AdminModel.__getUsersPageCount(filter)
        .then((count) => {
          if (page !== undefined && page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(users);
        }))
      .catch((err) => error(res, err));
  }

  static getUser(req, res)
  {
    AdminModel.findOneUser(res.locals.admin, { _id: req.params.id }, userInfoFilter)
      .then((user) => res.json(user))
      .catch((err) => error(res, err));
  }

  /**
   * Creates a new user
   * @method addUser
   * @param  {Object} req The message sent by the browser
   *                      { body: { email: string, password: string,
   *                        name: string [, phone: string] }}
   * @param  {Object} res The message sent back to the client from the server
   *                          Success: { user: object }
   *                          Failure: { auth: false, error: string }
   */
  static addUser(req, res)
  {
    AdminModel.createUser(res.locals.admin, req.body)
      .then((user) =>
        new Mailer().verifyEmail(user.email)
          .then(() => user))
      .then((user) => {
        user = user.toObject(); // do this to allow for delete command
        delete user.password;
        delete user.__v;

        return res.json(user);
      })
      .catch((err) => error(res, err));
  }

  static deleteUser(req, res)
  {
    UserModel.findOneUser({ _id: req.params.id })
      .then((user) =>
        AdminModel.deleteUserById(res.locals.admin, req.params.id)
          .then(() => user))
      .then((user) => new Mailer().deleteEmail(user.email))
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static updateUser(req, res)
  {
    AdminModel.editUser(res.locals.admin, req.params.id, req.body)
      .then((updatedUser) => res.json(updatedUser))
      .catch((err) => error(res, err));
  }

  static getAllOrganizations(req, res)
  {
    const page = req.query.page;
    const filter = req.body;
    AdminModel.findOrganizations(res.locals.admin, filter, { page })
      .then((orgs) => AdminModel.__getOrganizationsPageCount(filter)
        .then((count) => {
          if (page !== undefined && page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(orgs);
        }))
      .catch((err) => error(res, err));
  }

  static addOrganization(req, res)
  {
    AdminModel.createOrganization(res.locals.admin, req.body)
      .then((org) => {
        org = org.toObject();
        delete org.__v;
        return res.json(org);
      })
      .catch((err) => error(res, err));
  }

  static getOrganization(req, res)
  {
    AdminModel.findOneOrganization(res.locals.admin, { _id: req.params.id })
      .then((org) => res.json(org))
      .catch((err) => error(res, err));
  }

  static updateOrganization(req, res)
  {
    AdminModel.editOrganization(res.locals.admin, req.params.id, req.body)
      .then((org) => res.json(org))
      .catch((err) => error(res, err));
  }

  static deleteOrganization(req, res)
  {
    AdminModel.deleteOrganizationById(res.locals.admin, req.params.id)
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static getAllGames(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = req.query.page;
    const filter = req.body;

    AdminModel.findGames(res.locals.admin, filter, { page, populate })
      .then((games) => AdminModel.__getGamesPageCount(filter)
        .then((count) => {
          if (page !== undefined && page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(games);
        }))
      .catch((err) => error(res, err));
  }

  static getGame(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    AdminModel.findOneGame(res.locals.admin, { _id: req.params.id }, { populate })
      .then((game) => res.json(game))
      .catch((err) => error(res, err));
  }

  static addGame(req, res)
  {
    AdminModel.createGame(res.locals.admin, req.body)
      .then((game) => {
        game = game.toObject();
        delete game.__v;
        return res.json(game);
      })
      .catch((err) => error(res, err));
  }

  static updateGame(req, res)
  {
    AdminModel.editGame(res.locals.admin, req.params.id, req.body)
      .then((game) => res.json(game))
      .catch((err) => error(res, err));
  }

  static deleteGame(req, res)
  {
    AdminModel.deleteGameById(res.locals.admin, req.params.id)
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static getAllActiveGames(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = req.query.page;
    const filter = req.body;

    AdminModel.findActiveGames(res.locals.admin, filter, { page, populate })
      .then((activeGames) => AdminModel.__getActiveGamesPageCount(filter)
        .then((count) => {
          if (page !== undefined && page != 1 && page > count)
            return error(res, new ResourceNotFoundError(' page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(activeGames);
        }))
      .catch((err) => error(res, err));
  }

  static getActiveGame(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    AdminModel.findOneActiveGame(res.locals.admin, { _id: req.params.id }, { populate })
      .then((activeGame) => res.json(activeGame))
      .catch((err) => error(res, err));
  }

  static getGameWinners(req, res)
  {
    AdminModel.getGameWinners(res.locals.admin, req.params.id)
      .then((winners) => res.json(winners))
      .catch((err) => error(res, err));
  }

  static setWinningTile(req, res)
  {
    AdminModel.setWinningTile(res.locals.admin, req.params.id, req.body.tile)
      .then(() => AdminModel.getGameWinners(res.locals.admin, req.params.id))
      .then((winners) => {
        // send bulk email
        const okEmails = [];
        const okTemplateData = [];
        const needLocationEmails = [];
        const needLocationTemplateData = [];
        for (let i = 0; i < winners.length; i++)
        {
          const user = winners[i].userID;

          if (user.location === undefined || user.location.state === undefined ||
            user.location.zip === undefined || user.location.address === undefined ||
            user.location.city === undefined)
          {
            needLocationEmails.push(user.email);
            needLocationTemplateData.push(winners[i]);
          }
          else
          {
            okEmails.push(user.email);
            okTemplateData.push(winners[i]);
          }
        }

        const emptyDonation = {
          amount: 0, // in cents
          userID: {
            name: 'name',
            email: 'email',
            phone: 'phone',
            dob: moment.utc(),
            location: {
              address: 'address',
              state: 'state',
              zip: 'zip',
              city: 'city',
            },
          },
          organizationID: {
            name: 'name',
            photo: 'photo',
            abbreviation: 'abbreviation',
            email: 'email',
          },
          gameID: {
            name: 'name', // TODO add to data model
            organizations: [],
            startTime: moment.utc(),
            endTime: moment.utc(),
            winningTile: 0,
            board: [], // TODO update in data model
            price: 0, // in cents
            streamUrl: '',
          },
          stripeID: '',
          date: moment.utc(),
          tiles: [],
        };

        const tasks = [];
        if (okEmails.length > 0)
          tasks.push(new Mailer().sendBulkEmail(okEmails, okTemplateData,
            emptyDonation, winningTemplateName));

        if (needLocationEmails.length > 0)
          tasks.push(new Mailer().sendBulkEmail(needLocationEmails, needLocationTemplateData,
            emptyDonation, winningTemplateNeedLocationName));

        return Promise.all(tasks);
      })
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static getAllDonations(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    const page = req.query.page;
    const filter = req.body;
    AdminModel.findDonations(res.locals.admin, filter, { page, populate })
      .then((donations) => AdminModel.__getDonationsPageCount(filter)
        .then((count) => {
          if (page !== undefined && page != 1 && page > count)
            return error(res, new ResourceNotFoundError('page not found'));
          res.set(numPagesHeaderName, count);
          return res.json(donations);
        }))
      .catch((err) => error(res, err));
  }

  static getDonation(req, res)
  {
    const populate = (req.query.populate !== undefined) ? req.query.populate : false;
    AdminModel.findOneDonation(res.locals.admin, { _id: req.params.id }, { populate })
      .then((donation) => res.json(donation))
      .catch((err) => error(res, err));
  }

  static deleteDonation(req, res)
  {
    AdminModel.deleteDonationById(res.locals.admin, req.params.id)
      .then(() => res.json({ success: true }))
      .catch((err) => error(res, err));
  }

  static searchUsers(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchUsers(res.locals.admin, filter, { page, populate })
      .then((users) => res.json(users))
      .catch((err) => error(res, err));
  }

  static searchAdmins(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchAdmins(res.locals.admin, filter, { page, populate })
      .then((admins) => res.json(admins))
      .catch((err) => error(res, err));
  }

  static searchOrganizations(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchOrganizations(res.locals.admin, filter, { page, populate })
      .then((organizations) => res.json(organizations))
      .catch((err) => error(res, err));
  }

  static searchGames(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchGames(res.locals.admin, filter, { page, populate })
      .then((games) => res.json(games))
      .catch((err) => error(res, err));
  }

  static searchActiveGames(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchActiveGames(res.locals.admin, filter, { page, populate })
      .then((games) => res.json(games))
      .catch((err) => error(res, err));
  }

  static searchDonations(req, res)
  {
    const page = req.query.page;
    const populate = req.query.populate;
    const filter = req.body;
    AdminModel.searchDonations(res.locals.admin, filter, { page, populate })
      .then((donations) => res.json(donations))
      .catch((err) => error(res, err));
  }
}
