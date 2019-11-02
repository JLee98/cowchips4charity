import AWS from 'aws-sdk';

import { AWSError } from '../errors';

export default class Mailer
{
  /**
   * Sets initial properties for Mailer
   * @method constructor
   */
  constructor()
  {
    this.aws = AWS;
    // set config
    this.aws.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // simple email service object
    this.ses = new this.aws.SES({ apiVersion: process.env.AWS_API_VERSION });
  }

  /**
   * Sends a "verify yourself" email to the email address passed.
   * @method verifyEmail
   * @param  {String}    email the email to send verification to
   * @return {Promise}         A promise object that is resolved if no errors,
   *                           or rejected if an error occurred.
   */
  verifyEmail(email)
  {
    return this.ses.verifyEmailIdentity({ EmailAddress: email }).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Deletes a verified email from the verified emails list
   * @method deleteEmail
   * @param  {String}    email the email to be deleted
   * @return {Promise}         A promise object that is resolved if no errors,
   *                           or rejected if an error occurred.
   */
  deleteEmail(email)
  {
    return this.ses.deleteIdentity({ Identity: email }).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Sends a templated email specified by templateName to all of the emails
   * specified in the emails array, using the information in the templateData
   * array.
   * @method sendBulkEmail
   * @param  {String[]}    emails              email addresses to send templated email to
   * @param  {Object[]}    templateData        array of objects containing data to be used in
   *                                           templates for each email in the emails list.
   *
   *                                           emails[i] has template information in templateData[i]
   *
   * @param  {Object}      defaultTemplateData default data for blank templateDatums
   * @param  {String}      templateName        name of template already stored on AWS
   * @return {Promise}                         A promise object that is resolved if no errors,
   *                                           or rejected if an error occurred.
   */
  sendBulkEmail(emails, templateData, defaultTemplateData, templateName)
  {
    const splitSizes = 50; // how many emails in each bulk email batch
    const tasks = [];
    let Destinations = [];

    let i;
    for (i = 0; i < emails.length; i++)
    {
      if (i % splitSizes === 0 && i !== 0)
      {
        tasks.push(this.sendBulkEmailHelper(Destinations, defaultTemplateData, templateName));
        Destinations = []; // clear destinations
      }

      Destinations.push({
        Destination: { ToAddresses: [emails[i]] },
        ReplacementTemplateData: JSON.stringify(templateData[i]),
      });
    }

    // if it wasn't a clean split and there are some emails left over
    if (Destinations.length > 0)
      tasks.push(this.sendBulkEmailHelper(Destinations, defaultTemplateData, templateName));

    return Promise.all(tasks)
      .catch(err => { throw new AWSError(err); });
  }

  /**
   * helper for sending bulk emails, should not be used outside of this class
   * @method sendBulkEmailHelper
   * @param  {Object[]}          Destinations        Destinations object as specified by AWS
   * @param  {Object}            defaultTemplateData default data for blank information
   * @param  {String}            Template            template name to be used (must be on AWS
   *                                                 look in scripts/templates/)
   * @return {Promise}                               A promise with sending statuses
   */
  sendBulkEmailHelper(Destinations, defaultTemplateData, Template)
  {
    const bulkEmail = {
      Template,
      Destinations,
      Source: process.env.SOURCE_EMAIL,
      DefaultTemplateData: JSON.stringify(defaultTemplateData),
    };

    return this.ses.sendBulkTemplatedEmail(bulkEmail).promise();
  }

  /**
   * Creates a template on the aws server
   * @method createTemplate
   * @param  {String}       TemplateName the name of the template to create (must be unique)
   * @param  {String}       SubjectPart  the subject of the email
   * @param  {String}       HtmlPart     the html version of the email
   * @param  {String}       TextPart     the text only version of the email
   * @return {Promise}                   A promise object that is resolved if no errors,
   *                                     or rejected if an error occurred.
   */
  createTemplate(TemplateName, SubjectPart, HtmlPart, TextPart)
  {
    const template = {
      Template: {
        TemplateName,
        SubjectPart,
        HtmlPart,
        TextPart,
      },
    };

    return this.ses.createTemplate(template).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Fetches a template from the AWS server
   * @method getTemplate
   * @param  {String}    TemplateName nique name of the template to fetch
   * @return {Promise}                A promise containing the template information
   *                                  if successful, otherwise an AWS error
   */
  getTemplate(TemplateName)
  {
    return this.ses.getTemplate({ TemplateName }).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Deletes a specified template from the AWS server
   * @method deleteTemplate
   * @param  {String}       TemplateName unique name of the email to delete
   * @return {Promise}                   promise containing transaction information
   *                                     if successful, otherwise reject with AWSError
   */
  deleteTemplate(TemplateName)
  {
    return this.ses.deleteTemplate({ TemplateName }).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Lists templates on the AWS server
   * @method listTemplates
   * @param  {Number}      [MaxItems=undefined]  The maximum number of items
   * @param  {Number}      [NextToken=undefined] The token for the next page
   * @return {Promise}                           a list of templates
   */
  listTemplates(MaxItems = undefined, NextToken = undefined)
  {
    return this.ses.listTemplates({ MaxItems, NextToken }).promise()
      .catch((err) => { throw new AWSError(err); });
  }

  /**
   * Updates a specified template with the specified data on AWS server
   * @method updateTemplate
   * @param  {String}       TemplateName unique name of the template to update
   * @param  {Object}       [updates={}] the data to update for the template (leave
   *                                     fields not being updated as undefined)
   * @return {Promise}                   a promise
   */
  updateTemplate(TemplateName, updates = {})
  {
    const template = {
      Template: {
        TemplateName,
        HtmlPart: updates.HtmlPart,
        SubjectPart: updates.SubjectPart,
        TextPart: updates.TextPart,
      },
    };

    return this.ses.updateTemplate(template).promise()
      .catch((err) => { throw new AWSError(err); });
  }
}
