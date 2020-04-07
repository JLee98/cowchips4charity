import express from 'express';

import OrganizationController from '../controllers/organization.controller';

'use strict';

const organizationRoutes = express();

organizationRoutes.route('/')
  .get(OrganizationController.getAllOrganizations);

organizationRoutes.route('/:id')
  .get(OrganizationController.getOrganization);

export default organizationRoutes;
