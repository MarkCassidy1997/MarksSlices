// This file is empty, but some people were reporting that it would not start unless they had an empty file. So here it is! You can delete the comment. Or replace it with your favourite shania twain lyrics.

import dotenv from 'dotenv';

// Include the .env file that we made
dotenv.config({
  path: '.env',
});

export default {
  siteMetadata: {
    title: `Marks Slices`,
    siteUrl: 'https://gatsby.pizza',
    description: 'The best Pizza place in all of Bury! :)',
    twitter: '@MarksSlices',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      // This is the name of the plugin that you're adding
      resolve: 'gatsby-source-sanity',
      options: {
        // Get this from https://manage.sanity.io/
        projectId: 'p812wqtb',
        // Get this from https://manage.sanity.io/ Then click the Datasets tab
        dataset: 'production',
        // Real time editing, just always have this on....
        watchMode: true,
        // Get this from https://manage.sanity.io/ Then click the Settings tab, Then click API (under General) and click 'ADD NEW TOKEN',
        // add a Label and leave as Read, this is secret so need to come from .env
        token: process.env.SANITY_TOKEN,
      },
    },
  ],
};
