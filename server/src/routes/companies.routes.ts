/**
 * User: abhijit.baldawa
 *
 * This module contains all the routes for '/companies' endpoint
 */

import { Router } from 'express';
import { getAllConstructionCompanies } from '../controllers/companies.controller';

const router = Router();

router.get('/', getAllConstructionCompanies);

export default router;
