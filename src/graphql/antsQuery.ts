import { gql } from "@apollo/client";

export const antsQuery = gql`
query ants {
  ants {
      name
      length
      color
      weight
    }
}
`;