const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter } = require('forest-express-sequelize');
const { IncomingWebhook } = require('@slack/webhook');
const fs = require('fs');
const axios = require('axios');
const { companies } = require('../models');
const isAllowed = require('../services/scopes-checker');
const getVideoURL = require('../forest/companies');

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
router.get('/companies/:recordId', permissionMiddlewareCreator.details(), async (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
  // try {
  //   await isAllowed(request, response);
  // } catch (error) {
  //   console.error(error);
  // } finally {
  //   next();
  // }
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

/* function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
} */

const webhook = new IncomingWebhook(url);

router.post('/actions/reject-application', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  // Get input form attributes
  const attributes = await request.body.data.attributes.values;
  const rejectionReason = attributes['Reason(s) for rejection'];
  const comment = attributes['Comment'];

  // Get selected company
  const [selectedCompanyId] = await new RecordsGetter(companies).getIdsFromRequest(request);
  const selectedCompany = await companies.findByPk(selectedCompanyId);

  // Change company status to rejected
  console.log(comment);
  if (comment === 'error') {
    response.status(400).send({ error: 'This is not a valid reason' });
  } else {
    await companies.update({ status: 'rejected' }, { where: { id: selectedCompanyId } });
    response.send({ success: 'Company\'s request to go live rejected!' });
    await webhook.send({
      text: 'An action has been triggered from Forest Admin',
      channel: 'C01CFGCADGF', // Slack channel ID
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
            text: `${request.user.firstName} ${request.user.lastName} just rejected <https://app.forestadmin.com/Live-demo/Production/Operations/data/companies/index/record/companies/${selectedCompanyId}/summary|${selectedCompany.name}>'s request to go live!\n\n • *Reason for rejection:* ${rejectionReason[0]}\n • *Comment:* ${comment}`,
          },
          accessory: {
            type: 'image',
            image_url: 'https://pbs.twimg.com/profile_images/1122733397271613440/gE7ZUfPA.jpg',
            alt_text: 'company logo',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'For more details on the company',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Notes',
              emoji: true,
            },
            value: 'null',
            url: `https://app.forestadmin.com/Live-demo/Production/Operations/data/companies/index/record/companies/${selectedCompanyId}/collaboration`,
            action_id: 'button-action',
          },
        },
      ],
    });
  }
  // Initialize Slack webhook
});

// Cancel rejection
router.post('/actions/cancel-rejection', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  const selectedCompanyIds = await new RecordsGetter(companies).getIdsFromRequest(request);
  // Change company status to rejected
  await companies.update({ status: 'pending' }, { where: { id: selectedCompanyIds } });
  response.send({ success: 'Company\'s pending status reset' });
/*   response.send({
    html: `
    <style>
    .container {
      width:600px;
      height:450px;
      overflow-x: scroll;
    }
    .demo {
      width:1000px;
      height:420px;
      border:1px solid #54BD7E;
      border-collapse:collapse;
      padding:5px;
    }
    .demo th {
      border:1px solid #54BD7E;
      padding:5px;
      background:#0f222a;
      color: #FAFBFB;
    }
    .demo td {
      border:1px solid #54BD7E;
      padding:5px;
      color: #FAFBFB;
    }
    a {
      color: #FAFBFB;
      text-decoration: underline;
    }
  </style>
  <div class="container">
    <table class="demo">
      <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
        <th>Header 4</th>
        <th>Header 5</th>
        <th>Header 6</th>
        <th>Header 7</th>
        <th>Header 8</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow" target="_blank">CSS Overflow</a></td>
      </tr>
      <tbody>
    </table>
  </div>`,
  }); */
});

router.post('/actions/play-video', permissionMiddlewareCreator.smartAction(), async (request, response) => {
  const [selectedCompanyId] = await new RecordsGetter(companies).getIdsFromRequest(request);
  const selectedCompany = await companies.findByPk(selectedCompanyId);
  const path = await getVideoURL(selectedCompany);
  /*   const stat = fs.statSync(path);
  const fileSize = stat.size;
  const { range } = request.headers;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(206, head);
    file.pipe(response);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(200, head);
    fs.createReadStream(path).pipe(response);
  } */
  const video = await axios.get(path);
  request.pipe(video);
  const head = {
    'Content-Type': 'video/mp4',
  };
  response.writeHead(206, head);
  video.pipe(response);
});

module.exports = router;
