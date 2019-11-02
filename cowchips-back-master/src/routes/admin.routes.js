import express from 'express';

import AdminController from '../controllers/admin.controller';
import { tokenParser } from '../middleware/admin.middleware';

'use strict';

const adminRoutes = express();
adminRoutes.route('/login')
  .post(AdminController.login);

adminRoutes.use('/', tokenParser);

// users
adminRoutes.route('/users')
  .get(AdminController.getAllUsers)
  .post(AdminController.addUser);

adminRoutes.route('/users/search')
  .post(AdminController.searchUsers);

adminRoutes.route('/users/:id')
  .get(AdminController.getUser)
  .put(AdminController.updateUser)
  .delete(AdminController.deleteUser);

// Admins
adminRoutes.route('/account')
  .get(AdminController.getAccount)
  .put(AdminController.updateAccount);

adminRoutes.route('/admins')
  .get(AdminController.getAllAdmins)
  .post(AdminController.addAdmin);

adminRoutes.route('/admins/search')
  .post(AdminController.searchAdmins);

adminRoutes.route('/admins/:id')
  .get(AdminController.getAdmin)
  .put(AdminController.updateAdmin)
  .delete(AdminController.deleteAdmin);

// organizations
adminRoutes.route('/organizations')
  .get(AdminController.getAllOrganizations)
  .post(AdminController.addOrganization);

adminRoutes.route('/organizations/search')
  .post(AdminController.searchOrganizations);

adminRoutes.route('/organizations/:id')
  .get(AdminController.getOrganization)
  .put(AdminController.updateOrganization)
  .delete(AdminController.deleteOrganization);

// games
adminRoutes.route('/games')
  .get(AdminController.getAllGames)
  .post(AdminController.addGame);

adminRoutes.route('/games/search')
  .post(AdminController.searchGames);

adminRoutes.route('/games/active')
  .get(AdminController.getAllActiveGames);

adminRoutes.route('/games/active/search')
  .post(AdminController.searchActiveGames);

adminRoutes.route('/games/active/:id')
  .get(AdminController.getActiveGame);

adminRoutes.route('/games/:id')
  .get(AdminController.getGame)
  .put(AdminController.updateGame)
  .delete(AdminController.deleteGame);

adminRoutes.route('/games/:id/winners')
  .get(AdminController.getGameWinners);

adminRoutes.route('/games/:id/set-winning-tile')
  .post(AdminController.setWinningTile);

// donations
adminRoutes.route('/donations')
  .get(AdminController.getAllDonations);

adminRoutes.route('/donations/search')
  .post(AdminController.searchDonations);

adminRoutes.route('/donations/:id')
  .get(AdminController.getDonation)
  .delete(AdminController.deleteDonation);

export default adminRoutes;
