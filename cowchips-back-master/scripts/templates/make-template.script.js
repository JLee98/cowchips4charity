import Readline from 'readline';
import fs from 'fs';

import Mailer from '../../src/mailing/mailer';

require('dotenv').config();

const usage = 'Please place the html and text templates in a folder with the ' +
              'name of the template under email-templates in the root directory ' +
              'of this project.\n' +
              'For a template named test-template, you should have:\n' +
              '\temail-templates/test-template/template.html\n' +
              '\temail-templates/test-teamplte/template.txt\n';

const enc = 'utf-8';

const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const templatesDirectory = './email-templates/';
const textTemplate = '/template.txt';
const htmlTemplate = '/template.html';

let templateName = '';
let templateSubject = '';
let templateHtml = '';
let templateText = '';

function getInput(prompt)
{
  return new Promise((resolve, reject) =>
    readline.question(prompt, input => resolve(input)));
}

console.log(usage);

getInput('Enter template name: ')
  .then(name => templateName = name)
  .then(() => getInput('Enter template subject: '))
  .then(subject => templateSubject = subject)
  .then(() => {
    templateHtml = fs.readFileSync(templatesDirectory + templateName + htmlTemplate, enc);
    templateText = fs.readFileSync(templatesDirectory + templateName + textTemplate, enc);

    return new Mailer()
      .createTemplate(templateName, templateSubject, templateHtml, templateText);
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));
