const { collection } = require('forest-express-sequelize');
const parsePassport = require('../services/documentParser');
const { orders, products } = require('../models');
const _ = require('lodash');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('customers', {
  actions: [
    // {
    //   name: 'Permissions Retriever',
    //   type: 'global',
    // },
    {
      name: 'Extract and Save Passport Info',
      type: 'single',
      fields: [
        // {
        //   field: 'passportDocument',
        //   type: 'File',
        // },
        {
          field: 'identityNumber',
          type: 'String',
        },
        {
          field: 'countryCode',
          type: 'String',
        },
        {
          field: 'givenNames',
          type: 'String',
        },
        {
          field: 'surname',
          type: 'String',
        },
        {
          field: 'dateOfBirth',
          type: 'Date',
        },
        {
          field: 'placeOfBirth',
          type: 'String',
        },
        {
          field: 'gender',
          type: 'String',
        },
        {
          field: 'issuanceDate',
          type: 'Date',
        },
        {
          field: 'expiryDate',
          type: 'Date',
        },
        {
          field: 'mrzOne',
          type: 'String',
        },
        {
          field: 'mrzTwo',
          type: 'String',
        },
      ],
      hooks: {
        load: async ({ fields }) => {
          const newFields = fields;
          const parsedPassport = await parsePassport();
          newFields.identityNumber.value = parsedPassport.id_number.value;
          newFields.countryCode.value = parsedPassport.country.value;
          newFields.givenNames.value = parsedPassport.given_names[0].value;
          newFields.surname.value = parsedPassport.surname.value;
          newFields.dateOfBirth.value = parsedPassport.birth_date.value;
          newFields.placeOfBirth.value = parsedPassport.birth_place.value;
          newFields.gender.value = parsedPassport.gender.value;
          newFields.issuanceDate.value = parsedPassport.issuance_date.value;
          newFields.expiryDate.value = parsedPassport.expiry_date.value;
          newFields.mrzOne.value = parsedPassport.mrz1.value;
          newFields.mrzTwo.value = parsedPassport.mrz2.value;
          return newFields;
        },
      },
    },
    {
      name: 'Update order status',
      type: 'single',
      fields: [{
        field: 'order',
        type: 'Enum',
        enums: [],
        reference: 'orders.ref',
        widget: 'belongsToSelect',
      }, {
        field: 'status',
        type: 'Enum',
        enums: ['Ready for shipping', 'Being processed', 'In transit', 'Shipped'],
      }, {
        field: 'Montant',
        type: 'Number',
      }],
      hooks: {
        load: async ({ fields, record }) => {
          const newFields = fields;
          const customerOrders = await orders.findAll({ where: { customerIdKey: record.id } });
          const customerOrdersIds = await _.chain(customerOrders).map((element) => _.values(_.pick((element), 'ref'))).flatten().value();
          // const customerOrdersIds = await _.chain(customerOrders).map((element) => _.pick((element), ['ref', 'deliveryIdKey'])).flatten().value();
          newFields.order.enums = customerOrdersIds;
          return newFields;
        },
      },
    },
  ],
  fields: [{
    field: 'Fullname',
    get: (customer) => `${customer.firstname} ${customer.lastname}`,
  }],
  segments: [],
});
