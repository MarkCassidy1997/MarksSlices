import { useState, useEffect } from 'react';

// This can be used to help format the query in the body when you paste it in!! This isn't required at all and can be removed
const gql = String.raw;
// Then wrap your query in curly brackets to format it e.g.
// ? const data = gql`
// ?   { Remove this line
// ?     query {
// ?       .....
// ?     }
// ?   } Remove this line
// ? `;

const commonData = gql`
    name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;

export default function useLatestData() {
  // hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();
  // Use a side effect to fetcht he data from the graphql endpoint
  useEffect(function () {
    console.log('FETCHING DATA');
    // when the component loads, fetch the data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                ${commonData}
              }
              hotSlices {
                name
                ${commonData}
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: check for errors
        // set the data to state

        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log(err);
        console.log('Something went wrong!');
      });
  }, []);
  return {
    hotSlices,
    slicemasters,
  };
}
