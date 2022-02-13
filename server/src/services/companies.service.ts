/**
 * User: abhijit.baldawa
 *
 * companies service module
 */

import constructionCompanies from './dummyData/constructionCompanies.json';

/**
 * @public
 *
 * Returns list of all construction companies
 *
 */
const getAllConstructionCompanies = () => constructionCompanies;

export { getAllConstructionCompanies };
