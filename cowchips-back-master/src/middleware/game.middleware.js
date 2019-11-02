import moment from 'moment';

import { BadRequestError } from '../errors';
import { error } from '../response';

/**
 * Middleware that converts startTime and endTime into UTC
 * @method dateParser
 * @param  {Object}   req  request from the client
 * @param  {Object}   res  resonse used by server to answer the client
 * @param  {Function} next next method to call after execution
 */
function dateParser(req, res, next)
{
  try {
    if (req.body.startTime !== undefined)
      req.body.startTime = moment.utc(req.startTime).toDate();
    if (req.body.endTime !== undefined)
      req.body.endTime = moment.utc(req.endTime).toDate();
    next();
  }
  catch (err) {
    error(res, new BadRequestError('Dates malformed'));
  }
}

export { dateParser };
