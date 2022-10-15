import { client } from "./foundation/ApolloClient/client";
import { ApolloProvider } from '@apollo/client';
import { Race } from "./components/Race";


const App = () => (
  <ApolloProvider client={client}>
    <Race />
    test
  </ApolloProvider>
);
export default App;