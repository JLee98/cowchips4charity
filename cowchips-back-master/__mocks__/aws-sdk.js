/**
 * Mocks the aws sdk npm package for testing
 * @type Class
 */

const aws = jest.genMockFromModule('aws-sdk');

export default aws;

/**
 * Mock config object
 * @type {Object}
 */
aws.config = {
  // do nothing
  update: (obj) => { },
};

/**
 * Mock Simple Email Service Object
 * @type {[type]}
 */
aws.SES = class SES {
  // do nothing
  constructor(obj) { obj.x = 0; }
  // return ok promise
  verifyEmailIdentity(email)
  {
    return {
      promise: () => Promise.resolve({ }),
    };
  }

  // return ok promise
  deleteIdentity(email)
  {
    return {
      promise: () => Promise.resolve({ }),
    };
  }

  // return ok promise
  sendBulkTemplatedEmail(params)
  {
    return {
      promise: () => Promise.resolve({ }),
    };
  }
};
