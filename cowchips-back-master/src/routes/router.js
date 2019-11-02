import express from 'express';

import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import organizationRoutes from './organization.routes';
import gameRoutes from './game.routes';
import donationRoutes from './donation.routes';

import { queryParser } from '../middleware/shared.middleware';

const router = express.Router();

router.use('/', queryParser);

router.use(userRoutes);
router.use('/game', gameRoutes);
router.use('/organization', organizationRoutes);
router.use('/admin', adminRoutes);
router.use('/donation', donationRoutes);

export default router;
