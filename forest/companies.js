const { collection } = require('forest-express-sequelize');

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
        field: 'Reason(s) for rejection',
        description: 'Please provide a reason for this decision',
        required: true,
        type: ['Enum'],
        enums: ['Certificate of Incorporation', 'Proof of Address ID', 'Bank Statement ID'],
      },
      {
        field: 'Comment',
        description: 'This comment will only be displayed in your slack workspace message',
        required: true,
        type: 'String',
        widget: 'text area',
      },
    ],
  },
  {
    name: 'Cancel rejection',
    type: 'bulk',
  }],
  fields: [],
  segments: [],
});
