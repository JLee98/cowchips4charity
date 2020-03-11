import { statusCode } from './response';

class ServerError extends Error
{
  constructor(err)
  {
    if (err)
      super(err.message);
    else
      super();

    if (typeof err !== 'string')
    {
      const props = Object.getOwnPropertyNames(err);
      for (const i in Object.getOwnPropertyNames(err))
        this[props[i]] = err[props[i]];
    }
  }
}

class UserAlreadyExistsError extends Error
{
  constructor(msg)
  {
    super(msg);
    this.statusCode = statusCode.UNAUTHORIZED;
    this.response = 'user already exists';
  }
}

class IncorrectUsernamePasswordError extends Error
{
  constructor(msg)
  {
    super(msg);
    this.statusCode = statusCode.UNAUTHORIZED;
    this.response = 'incorrect username and/or password';
  }
}

class BadRequestError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = statusCode.BAD_REQUEST;
    if (typeof err === 'string')
      this.response = err;
    else
      this.response = 'the request was invalid';
  }
}

class DatabaseError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = statusCode.SERVER_ERROR;
    this.response = 'internal server error';
  }
}

class AuthenticationError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = statusCode.UNAUTHORIZED;
    this.response = 'you do not have the proper permissions to perform that action';
  }
}

class StripeError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = err.statusCode;
    this.response = err.message;
  }
}

class PermissionError extends Error
{
  constructor(msg, permission)
  {
    super(msg);
    this.statusCode = statusCode.UNAUTHORIZED;
    this.response = 'missing permission: ' + permission;
  }
}

class ResourceNotFoundError extends Error
{
  constructor(msg)
  {
    super(msg);
    this.statusCode = statusCode.RESOURCE_NOT_FOUND;
    this.response = msg;
  }
}

class ValidationError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = statusCode.BAD_REQUEST;
    this.response = err.details;
  }
}

class AWSError extends ServerError
{
  constructor(err)
  {
    super(err);
    this.statusCode = statusCode.BAD_REQUEST;
    this.response = 'Something went wrong';
  }
}

export {
  UserAlreadyExistsError, IncorrectUsernamePasswordError, BadRequestError,
  DatabaseError, PermissionError, ResourceNotFoundError, AuthenticationError, StripeError,
  ValidationError, AWSError,
};
