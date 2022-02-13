/**
 * User: abhijit.baldawa
 *
 * This module exposes controller method's which are connected to /companies REST endpoint
 */

import { RequestHandler } from 'express';
import * as companiesService from '../services/companies.service';

/**
 * @public
 *
 * @RestEndPoint GET /companies
 *
 * Responds with array of construction companies
 *
 * @param req
 * @param res
 */
const getAllConstructionCompanies: RequestHandler<
  never,
  ReturnType<typeof companiesService.getAllConstructionCompanies>
> = (_, res) => {
  return res.status(200).json(companiesService.getAllConstructionCompanies());
};

export { getAllConstructionCompanies };
