/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to fetch environment variables
 */

import 'dotenv/config';

/**
 * @public
 *
 * Get port from environment variable or else default to 3000
 * This method returns the port number on which the server should run
 */
const getPort = (): number => (process.env.PORT ? +process.env.PORT : 3000);

export { getPort };
