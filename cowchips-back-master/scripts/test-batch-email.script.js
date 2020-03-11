import Mailer from '../src/mailing/mailer';

require('dotenv').config();

const emails = [
  'cbrust@iastate.edu',
  'dlev@iastate.edu',
];

const templateData = [
  {
    name: 'Connor Rust',
  },
  {
    name: 'Daniel Lev',
  },
];

const defaultTemplateData = {
  name: 'name',
};

const templateName = 'SampleTemplate';

Mailer.sendBulkEmail(emails, templateData, defaultTemplateData, templateName)
  .catch((err) => console.error(err))
  .then((data) => console.log(data));
