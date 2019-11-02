const accessDenied = (msg) => ({ auth: false, error: msg });

const statusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  RESOURCE_NOT_FOUND: 404,
  SERVER_ERROR: 500,

  OK: 200,
};

function error(res, err)
{
  // catch errors that we have not yet wrapped in one of our own (for development really)
  // these shouldn't be reaching the end user and should be flagged and tracked down if they
  // do
  if (err.statusCode === undefined)
  {
    console.error(err);
    return res.status(statusCode.SERVER_ERROR).json(accessDenied('an unknown error occurred'));
  }
  return res.status(err.statusCode).json(accessDenied(err.response));
}

export {
  statusCode,
  error,
};
