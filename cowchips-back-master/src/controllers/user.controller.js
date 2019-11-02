import security from '../security/security';
import Mailer from '../mailing/mailer';

import {
  IncorrectUsernamePasswordError,
  ResourceNotFoundError,
  AWSError,
} from '../errors';

import { error } from '../response';
import UserModel from '../models/user.model';
import SharedValidator from '../validators/shared.validator';

import DonationModel from '../models/donation.model';

const userInfoFilter = '-password -__v';


export default class UserController
{
  /**
   * Performs the necessary checks to log a user in
   * @method login
   * @param  {object} req The request sent from the browser
   *                      { body: { email , password }}
   * @param  {object} res The response used by the server to answer the browser
   *                        400: Header did not contain the necessary information
   *                        401: Username or password is incorrect
   *                        200: Accesss granted
   *                        500: Internal server error (mongoose related)
   * @return {object}
   *                  success: { auth: true,  token: jwttoken }
   *                  failure: { auth: false, error: msg }
   */
  static login(req, res)
  {
    return SharedValidator.validateLogin(req.body)
      .then(() => UserModel.findOneUser({ email: req.body.email }))
      .then((user) => {
        if (!user || !security.passwordIsValid(req.body.password, user.password))
          throw new IncorrectUsernamePasswordError('incorrect username and/or password');
        else
          return res.json({
            auth: true,
            token: security.createToken(user),
          });
      })
      .catch((err) => error(res, err));
  }

  /**
   * Register a new email
   * @method register
   * @param  {object} req The request sent from the browser
   *                      { body: { email, password, name, phone }}
   * @param  {object} res The response used by the server to answer the browser
   *                        400: Header did not contain the necessary information
   *                        401: User already exists
   *                        200: Accesss granted
   *                        500: Internal server error (mongoose related)
   * @return {object}
   *                        success: { auth: true,  token: jwttoken }
   *                        failure: { auth: false, error: msg }
   */
  static register(req, res)
  {
    return UserModel.createUser(req.body)
      .then((user) =>
        new Mailer().verifyEmail(user.email)
          .catch((err) => { throw new AWSError(err); })
          .then(() => user))
      .then((user) => res.json({
        auth: true,
        token: security.createToken(user),
      }))
      .catch((err) => error(res, err));
  }

  /**
   * Get a users data given a jwt token with the id as payload
   * @method getAccount
   * @param  {object} req request from the browser, containing the cookies
   * @param  {object} res The response used by the server to answer the browser
   *                      401: User not found
   *                      200: Successful
   * @return {object}
   *                      success: { user: userObj }
   *                      failure: { auth: false, error: msg }
   */
  static getAccount(req, res)
  {
    UserModel.findOneUser({ _id: res.locals.token.id }, userInfoFilter)
      .then((user) => {
        if (!user)
          throw new ResourceNotFoundError('user not found');
        return res.json(user);
      })
      .catch((err) => error(res, err));
  }


  /**
   * Update the user with id contained within the authToken cookie
   * @method updateAccount
   * @param  {object}   req The request from the browser, the body of req should contain
   *                        the components wished to be updated
   * @param  {object}   res The response from the server
   *                        401: User not found
   *                        200: Successful
   * @return {object}
   *                        success: { user: userObj }
   *                        failure: { auth: false, error: msg }
   */
  static updateAccount(req, res)
  {
    UserModel.editUser(res.locals.token.id, req.body)
      .then((updatedUser) => res.json(updatedUser))
      .catch((err) => error(res, err));
  }

  static getTiles(req, res)
  {
    DonationModel.findDonations({ userID: res.locals.token.id }, { populate: true })
      .then((donations) => res.json(donations))
      .catch((err) => error(res, err));
  }
}
