import Mailer from '../../src/mailing/mailer';

require('dotenv').config();

const warning = '**\nWARNING: This module is untested with more than 1 page of templates!\n**\n';
const maxTemplates = 10;
const m = new Mailer();

function fetchTemplatesRec(token = undefined)
{
  const templates = [];
  return m.listTemplates(maxTemplates, token)
    .then(data => {
      templates.push(data.TemplatesMetadata);
      if (data.NextToken !== undefined)
        return fetchTemplatesRec(data.NextToken)
          .then(childData => (templates.push(childData)));
    })
    .then(() => templates)
    .catch(err => console.error(err));
}

function fetchTemplates()
{
  fetchTemplatesRec()
    .then((templates) => {
      console.warn(warning);
      console.log(templates);
      console.warn(warning);
    });
}

fetchTemplates();
