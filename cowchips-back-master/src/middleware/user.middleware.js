import security from '../security/security';
import { error } from '../response';

function tokenParser(req, res, next)
{
  if (!req.headers || !req.headers.authorization)
    return res.status(401).json({
      auth: false,
      error: 'you do not have the proper permissions to perform that action',
    });

  return security.authenticateToken(req.headers.authorization)
    .then((token) => {
      res.locals.token = token;
      return next();
    })
    .catch((err) => error(res, err));
}

export { tokenParser };
