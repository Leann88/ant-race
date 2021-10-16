import { client } from "./ApolloClient/client";
import { ApolloProvider } from '@apollo/client';
import { Race } from "./Race";


const App = () => (
  <ApolloProvider client={client}>
    <Race />
  </ApolloProvider>
);
export default App;