import fs from 'fs';

import server from '../src/server'; // for initialization of db connection

import OrganizationModel from '../src/models/organization.model';

const dataFile = './scripts/data/teams.txt';
const delim = /\t+/; // split by groups of tabs
const enc = 'utf-8';
const newline = /[\r\n]+/;

fs.readFile(dataFile, enc, (err, contents) => {
  if (err)
  {
    console.error(err);
    return;
  }

  const promises = [];

  const lines = contents.split(newline);
  lines.forEach(line => {
    if (line)
    {
      const teamData = line.split(delim);

      if (teamData.length % 2 !== 0)
        throw new Error('Expected data of the form:\n\t <attribute-name> <value>\t<attribute-name> <value>\t...');

      const team = {};
      for (let i = 0; i < teamData.length; i += 2)
      {
        const attrName = teamData[i];
        const attrValue = teamData[i + 1];

        team[attrName] = attrValue;
      }

      console.log(team);
      promises.push(OrganizationModel.createOrganization(team));
    }
  });

  Promise.all(promises)
    .catch(e => console.error(e));
});
