const authTokenName = 'authToken';
const pageSize = 15;
const numPagesHeaderName = 'numpages';
const winningTemplateName = 'winning-template';
const winningTemplateNeedLocationName = 'winning-template-need-location';

const defaults = {
  projection: '-__v',
  userProjection: '-password -__v',
  populate: false,
};

const envs = {
  PRODUCTION: 'production',
  LOCAL: 'local',
  TEST: 'test',
};

export {
  authTokenName,
  pageSize,
  numPagesHeaderName,
  winningTemplateName,
  winningTemplateNeedLocationName,
  defaults,
  envs,
};
