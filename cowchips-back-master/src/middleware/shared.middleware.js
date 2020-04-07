function urlLogger(req, res, next)
{
  console.info(req.method + ':', req.originalUrl);
  next();
}

function queryParser(req, res, next)
{
  if (req.query.populate !== undefined)
    req.query.populate = (req.query.populate === 'true');
  next();
}

export { urlLogger, queryParser };
