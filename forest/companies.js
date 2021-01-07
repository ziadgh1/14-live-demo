/* eslint-disable max-len */
const { collection } = require('forest-express-sequelize');
const { companies } = require('../models/companies');

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
    // field: 'Description video',
    // type: 'String',
    // get: () => '<video controls src="http://localhost:3000/forest/actions/play-video" width="540"></video>',
    // get: () => `<iframe width="540" height="315" src="https://www.youtube.com/embed/vdKbdMVsHN0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    // get: () => '<iframe width="540" height="315" src="https://stream.mux.com/pZUcG8r5kbDUNSpFoKgvfgaFAe01ZUE9FYyxSb9piCy4.m3u8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
    // get: () => '<script>$.getScript("https://cdn.jsdelivr.net/npm/video.js@7.10.2/dist/video.cjs.min.js", () => { this.set("loaded", true); }</script> <video controls src="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4" width="540"></video>',
    // get: () => '<video controls width="540" src="https://stream.mux.com/pZUcG8r5kbDUNSpFoKgvfgaFAe01ZUE9FYyxSb9piCy4.m3u8" type="application/x-mpegURL"></video>',
    // get: () => '<script>$.getScript("https://cdn.jsdelivr.net/npm/video.js@7.10.2/dist/video.cjs.min.js", () => { this.set("loaded", true); }</script><script><video controls width="540" data-setup="{}"><source src="https://stream.mux.com/pZUcG8r5kbDUNSpFoKgvfgaFAe01ZUE9FYyxSb9piCy4.m3u8" type="application/x-mpegURL"></video>',
    // <video width="320" height="240" controls>
    //   <source src="https://stream.mux.com/pZUcG8r5kbDUNSpFoKgvfgaFAe01ZUE9FYyxSb9piCy4.m3u8" type="application/x-mpegURL">
    // </video>
    // get: () => '<script>$.getScript("https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js", () => { this.set("loaded", true); }</script><video class="video-js" controls data-setup="{}"><source src="https://stream.mux.com/pZUcG8r5kbDUNSpFoKgvfgaFAe01ZUE9FYyxSb9piCy4.m3u8" type="application/x-mpegURL"></video><script>$.getScript("https://vjs.zencdn.net/7.10.2/video.js", () => { this.set("loaded", true); }</script>',
  }],
  segments: [],
});
