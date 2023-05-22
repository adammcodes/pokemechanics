import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "../src/context/GameContextProvider";
import { Layout } from "../src/components/Layout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GameContextProvider>
    </QueryClientProvider>
  );
}