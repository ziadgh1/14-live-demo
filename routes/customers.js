const express = require('express');
const { PermissionMiddlewareCreator, RecordsGetter } = require('forest-express-sequelize');
const { customers, passports } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('customers');

// This file contains the logic of every route in Forest Admin for the collection customers:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Address
router.post('/customers', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Address
router.put('/customers/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Address
router.delete('/customers/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of customers
router.get('/customers', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of customers
router.get('/customers/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Address
router.get('/customers/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of customers
router.get('/customers.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of customers
router.delete('/customers', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

router.post('/actions/extract-and-save-passport-info', permissionMiddlewareCreator.delete(), async (request, response) => {
  const passportAttributes = request.body.data.attributes.values;
  const customerId = await new RecordsGetter(customers).getIdsFromRequest(request);
  // console.log(passportAttributes);
  try {
    const newPassportRegistered = await passports.create(passportAttributes);
    // eslint-disable-next-line max-len
    const updatedCustomerProfile = await customers.update({ passportIdKey: newPassportRegistered.id }, { where: { id: customerId } });
    response.status(200).send({
      success: 'Passport info succesfully extracted',
      redirectTo: `/Live-demo/Development/Operations/data/customers/index/record/passports/${newPassportRegistered.id}/summary`,
    });
  } catch (error) {
    response.status(400).send({ error: `${error}` });
  }
});

router.post('/actions/update-order-status', permissionMiddlewareCreator.delete(), async (request, response) => {
  const { attributes } = request.body.data;
  console.log(attributes);
});

module.exports = router;
