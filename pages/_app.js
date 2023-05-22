import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { GameContextProvider } from "../src/context/GameContextProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContextProvider>
        <Component {...pageProps} />
      </GameContextProvider>
    </QueryClientProvider>
  );
}