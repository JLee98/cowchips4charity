import express from 'express';

import DonationController from '../controllers/donation.controller';
import { tokenParser } from '../middleware/user.middleware';

'use strict';

const donationRoutes = express();

donationRoutes.use('/', tokenParser);

donationRoutes.route('/')
  .get(DonationController.getAllDonations)
  .post(DonationController.makeDonation);

donationRoutes.route('/:id')
  .get(DonationController.getDonation);

donationRoutes.route('/game/:gameID')
  .get(DonationController.getGameDonation)

donationRoutes.route('/org/:organizationID')
  .get(DonationController.getOrganizationDonation)

export default donationRoutes;
