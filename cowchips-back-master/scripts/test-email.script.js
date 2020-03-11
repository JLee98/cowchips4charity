import Mailer from '../src/mailing/mailer';

require('dotenv').config();

const testSuccessEmail = 'success@simulator.amazonses.com';
const numEmails = 1001;

const emails = [];
const templateData = [];
const defaultTemplate = { userID: { name: 'test' }, organizationID: { name: 'test' } };
for (let i = 0; i < numEmails; i++)
{
  emails.push(testSuccessEmail);
  templateData.push({ userID: { name: 'test' }, organizationID: { name: 'test' } });
}

new Mailer().sendBulkEmail(emails, templateData, defaultTemplate, 'winning-template')
  .catch(err => console.error(err));
