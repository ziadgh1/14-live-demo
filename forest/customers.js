const { collection } = require('forest-express-sequelize');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('customers', {
  actions: [
    {
      name: 'Permissions Retriever',
      type: 'global',
    },
  ],
  fields: [{
    field: 'Fullname',
    get: (customer) => `${customer.firstname} ${customer.lastname}`,
  }],
  segments: [],
});
