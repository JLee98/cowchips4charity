import express from 'express';

import UserController from '../controllers/user.controller';
import { tokenParser } from '../middleware/user.middleware';

const userRoutes = express();

'use strict';
// login in a user
userRoutes.route('/login')
  .post(UserController.login);

// register a new account
userRoutes.route('/register')
  .post(UserController.register);

userRoutes.use('/account', tokenParser);
userRoutes.route('/account')
  .get(UserController.getAccount)
  .put(UserController.updateAccount);

userRoutes.route('/account/tiles')
  .get(UserController.getTiles);

export default userRoutes;
