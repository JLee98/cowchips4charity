import security from '../security/security';
import { error } from '../response';
import AdminModel from '../models/admin.model';

function tokenParser(req, res, next)
{
  if (!req.headers || !req.headers.authorization)
    return res.status(401).json({
      auth: false,
      error: 'you do not have the proper permissions to perform that action',
    });

  return security.authenticateToken(req.headers.authorization)
    .then(tokenPayload => AdminModel.findOneAdmin({ _id: tokenPayload.id }))
    .then((admin) => {
      if (admin === undefined || admin === null)
        return res.status(401).json({
          auth: false,
          error: 'you do not have the proper permissions to perform that action',
        });

      res.locals.admin = admin;
      return next();
    })
    .catch((err) => error(res, err));
}

export { tokenParser };
