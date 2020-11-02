// The gatsby-node file can create dynamic pages without creating multiple pages everytime a new pizza is added
// We can also fetch external Apis here (the beers)

// To create a new page:
// ? 1. We make a new template in the templates folder
// ? 2. We run path.resolve(path to template)
// ? 3. Get the data using graphQl and then map over it
// ? 4. Assign the path which will be the url of the page (and the slug for child pages!!!)
// ? 5. Pass the path.resolve as the component!
// ? 6. Pass in the relevant data within context that you want to access in the template
// ? 7. Now, you should have pages set up with no data on the child pages, but it shouldn't blow up?
// ? 8. Next you need to go into the templates folder, and run a query for the individual slicemaster e.g (sanityPerson NOT allSanityPerson)

import path from 'path'; // Path isn't an NPM package, it just comes with node
import fetch from 'isomorphic-fetch'; // isomorphic-fetch as a normal fetch is for in the browser

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. Get a template for this page (we need to write some JSX and template it) ----- Made inside the /templates folder
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2. Query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // 3. Loop all pizzas and create a page for each one
  data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
      // What is the url for this new page???
      path: `pizza/${pizza.slug.current}`,
      // The path to the template
      component: pizzaTemplate,
      // In the react dev tools, if you search for SinglePizzaPage (which is the name of the template)
      // You can pass other data from this createPages method, it can be done using a context object
      // The data will then appear in pageContext {} (in the dev tools)
      context: {
        markCassidy: 'is the best',
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  const toppingsTemplate = path.resolve('./src/pages/pizzas.js');

  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);

  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingsTemplate,
      context: {
        topping: topping.name,
        // TODO Regex for topping
      },
    });
  });
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  // 1. Fetch a list of beers
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();
  // 2. Loop over each one, we could use forEach here but will use for of!
  for (const beer of beers) {
    // Create a node for each beer
    // Create a bunch of metaData about that data
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    // 3. Create a node for that beer
    actions.createNode({
      ...beer,
      ...nodeMeta,
    });
  }
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
  // 1. Query all slicemasters
  const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // 2. Turn each slicemaster into their own page
  data.slicemasters.nodes.forEach((slicemaster) => {
    actions.createPage({
      component: path.resolve('./src/templates/Slicemaster.js'),
      path: `/slicemaster/${slicemaster.slug.current}`,
      context: {
        name: slicemaster.person,
        slug: slicemaster.slug.current,
      },
    });
  });
  // 3. Figure out how many pages there are based on how many slicemasters there are, and how many per page
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);

  // Get all the Slicemasters and divide by page number to get the amount of pages
  const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);

  // 4. Loop from 1 to [number of pages] and create pages
  Array.from({ length: pageCount }).forEach((_, i) => {
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      // This data is passed to the template when we create it
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },
    });
  });
}

// Gatsby specific named function!!
export async function sourceNodes(params) {
  // Fetch a list of beers and source them into our Gatsby API :)
  await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

// Gatsby specific named function!!
export async function createPages(params) {
  // Create pages dynamically
  // Wait for all promises to be resolved before finishing this function
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSlicemastersIntoPages(params),
  ]);

  // 2. Toppings
  // 3. Slicemasters
}
