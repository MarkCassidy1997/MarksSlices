import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import styled from 'styled-components';
import SEO from '../components/SEO';

const PizzaGrid = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`;

const SinglePizzaPage = ({ data }) => {
  const { image, name, toppings } = data.sanityPizza;

  return (
    <>
      <SEO title={name} image={image?.asset?.fluid?.src} />
      <PizzaGrid>
        <Img fluid={image.asset.fluid} alt={name} />
        <div>
          <h2>{name}</h2>
          <ul>
            {toppings.map((topping) => (
              <li key={topping.id}>
                {topping.name} {topping.vegetarian && '(v)'}
              </li>
            ))}
          </ul>
        </div>
      </PizzaGrid>
    </>
  );
};

// This needs to be dynamic based on the slug passed in from the context object (in gatsby-node.js)
// We want to get the slug (which is passed in the query) and get the pizza if it's equal to the slug!
export const query = graphql`
  query($slug: String!) {
    sanityPizza(slug: { current: { eq: $slug } }) {
      name
      id
      image {
        asset {
          fluid(maxWidth: 800) {
            ...GatsbySanityImageFluid
          }
        }
      }
      toppings {
        name
        id
        vegetarian
      }
    }
  }
`;

export default SinglePizzaPage;
