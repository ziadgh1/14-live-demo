const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter } = require('forest-express-sequelize');
const { IncomingWebhook } = require('@slack/webhook');
const { companies } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');
const url = process.env.SLACK_WEBHOOK_URL;

// This file contains the logic of every route in Forest Admin for the collection companies:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Company
router.post('/companies', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Company
router.put('/companies/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Company
router.delete('/companies/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Companies
router.get('/companies', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Companies
router.get('/companies/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Company
router.get('/companies/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Companies
router.get('/companies.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Companies
router.delete('/companies', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

const webhook = new IncomingWebhook(url);

router.post('/actions/reject-company', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  const [selectedCompanyId] = await new RecordsGetter(companies).getIdsFromRequest(request);
  const selectedCompany = await companies.findByPk(selectedCompanyId);
  await companies.update({ status: 'rejected' }, { where: { id: selectedCompanyId } })
    .then(() => response.send({ success: 'Company\'s request to go live rejected!' }))
    .then(() => webhook.send({
      text: 'An action has been triggered from Forest Admin',
      channel: 'C01D9A8K97S',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Action triggered - Company application rejected :x:',
            emoji: true,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hey :wave: ${request.user.firstName} ${request.user.lastName} just rejected <https://future.forestadmin.com/Live-demo/Staging/Operations/data/companies/index/record/companies/${selectedCompanyId}/details|${selectedCompany.name}>'s request to go live!`,
          },
          accessory: {
            type: 'image',
            image_url: 'https://download.logo.wine/logo/Tesla%2C_Inc./Tesla%2C_Inc.-Logo.wine.png',
            alt_text: 'company logo',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'For more details about this company',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Notes',
              emoji: true,
            },
            value: 'click_me_123',
            url: `https://future.forestadmin.com/Live-demo/Staging/Operations/data/companies/index/record/companies/${selectedCompanyId}/collaboration`,
            action_id: 'button-action',
          },
        },
      ],
    }));
});

module.exports = router;
