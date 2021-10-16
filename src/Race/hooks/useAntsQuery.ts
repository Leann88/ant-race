import { gql, useQuery } from "@apollo/client";

const GET_ANTS = gql`
query ants {
  ants {
      name
      length
      color
      weight
    }
}
`;
export const useAntsQuery = () => {

    const { loading, error, data } = useQuery(GET_ANTS);

    return {
        ants: data?.ants || [],
        loading,
        error
    }

}