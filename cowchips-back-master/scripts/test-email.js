import Mailer from '../src/mailing/mailer';

const testSuccessEmail = 'success@simulator.amazonses.com';

const emails = [];
const templateData = [];
const defaultTemplate = { userID: { name: 'test' }, organizationID: { name: 'test' } };
for (let i = 0; i < 100; i++)
{
  emails.push(testSuccessEmail);
  templateData.push({ userID: { name: 'test' }, organizationID: { name: 'test' } });
}

new Mailer().sendBulkEmail(emails, templateData, defaultTemplate, 'winning-template')
  .then(data => console.log(data))
  .catch(err => console.error(err));
