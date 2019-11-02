import Mailer from '../../src/mailing/mailer';

require('dotenv').config();

const usage = `npm run get-template TEMPLATE_NAME

This script will get the specified template from the ses template storage.
`;

if (process.argv[2] === undefined)
{
  console.log(usage);
  process.exit(0);
}
const templateName = process.argv[2];

new Mailer().getTemplate(templateName)
  .then(data => console.log(data))
  .catch(err => console.error(err));
