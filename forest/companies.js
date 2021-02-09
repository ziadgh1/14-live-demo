/* eslint-disable max-len */
const { collection } = require('forest-express-sequelize');
// const { companies } = require('../models/companies');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments

collection('companies', {
  actions: [{
    name: 'Reject application',
    type: 'single',
    fields: [
      {
        field: 'Reason for rejection(s)',
        description: 'Please provide a reason for this decision',
        type: ['Enum'],
        enums: ['Certificate of Incorporation', 'Proof of Address ID', 'Bank Statement ID'],
        required: true,
      },
      {
        field: 'Comment',
        description: 'This comment will only be displayed in your slack workspace message',
        required: true,
        type: ['String'],
        widget: 'text area',
      },
    ],
    hooks: {
      load: ({ fields }) => {
        const newFields = fields;
        newFields.Comment.value = 'Type your text here';
        return newFields;
      },
    },
  },
  {
    name: 'Cancel rejection',
    type: 'bulk',
  },
  ],
  fields: [{
    field: 'company name',
    type: 'String',
    get: (company) => `${company.name}`,
  }],
  segments: [],
});
